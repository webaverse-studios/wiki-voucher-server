const fetch = require('node-fetch');

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
    const {collectionAddress, walletAddress} = req.query;
    const POLYGON_API_KEY = 'bN2G8nP-vDFAnRXksfpd7I7g5f9c0GqD'
    const baseURL = `https://polygon-mainnet.g.alchemy.com/v2/${POLYGON_API_KEY}/getNFTs/`
    console.log(baseURL, collectionAddress, walletAddress)
    const nftList = await fetch(`${baseURL}?owner=${walletAddress}&contractAddresses%5B%5D=${collectionAddress}`,
    {
        method: 'get',
        redirect: 'follow'
    }).then(response => response.json())
    console.log("nftlist", nftList)
    return res.json({ nftList });
}

export default allowCors(handler)
