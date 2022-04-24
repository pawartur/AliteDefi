export const apiParams = {
    1: {
        'apiURL': process.env.NEXT_PUBLIC_ETHERSCAN_MAINNET_API_ENDPOINT,
        'apiKey': process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
    },
    42: {
        'apiURL': process.env.NEXT_PUBLIC_ETHERSCAN_KOVAN_API_ENDPOINT,
        'apiKey': process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
    },
    137: {
        'apiURL': process.env.NEXT_PUBLIC_POLYGONSCAN_MAINNET_API_ENDPOINT,
        'apiKey': process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY
    },
}