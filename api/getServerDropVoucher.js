import { ethers } from "ethers";

const types = {
    NFTVoucher: [
        { name: "tokenId", type: "uint256" },
        { name: "contentURL", type: "string" },
        { name: "balance", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "expiry", type: "uint256" },
    ],
};
const SIGNING_DOMAIN_NAME = "Webaverse-voucher";
const SIGNING_DOMAIN_VERSION = "1";
const chainId = process.env.VOUCHER_SIGN_CHAINID; // Polygon Mainnet ChainID
const domain = {
    name: SIGNING_DOMAIN_NAME,
    version: SIGNING_DOMAIN_VERSION,
    verifyingContract: process.env.VOUCHER_SIGN_WEBAVERSEADDRESS, // webaverse smart contract address
    chainId,
};

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    '*'
  )
  res.setHeader("Content-Type", "application/json")
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const handler = async (req, res) => {
    const { signData } = req.body;
    console.log("Input Server signData: ", signData);

    let signer = new ethers.Wallet(
        process.env.VOUCHER_SIGN_PRIVATE_KEY // private key
    );
    console.log("env1", process.env.VOUCHER_SIGN_PRIVATE_KEY)
    console.log("env2", process.env.VOUCHER_SIGN_WEBAVERSEADDRESS)

    const signature = await signer._signTypedData(domain, types, signData);
    console.log("created Signature: ", signature);

    return res.json({
        ...signData,
        signature,
        "env1": process.env.VOUCHER_SIGN_PRIVATE_KEY,
        "env2": process.env.VOUCHER_SIGN_WEBAVERSEADDRESS
    });
}

module.exports = allowCors(handler)
