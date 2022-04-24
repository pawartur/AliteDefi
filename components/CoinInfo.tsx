import React from 'react'

const CoinInfo = (props) => {
    return <div className="rounded-md border p-2">
        <div className="text-sm">{props.symbol}</div>
        <div className="font-actor font-bold truncate text-lg">${(Number(props.amount) / Math.pow(10, props.decimal)) * parseFloat(props.priceInUSD)}</div>
    </div>
}

export default CoinInfo