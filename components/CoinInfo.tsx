import React from 'react'

const CoinInfo = (props) => {
    return <div className="rounded-md border bg-green-200 p-2 ring-2 ring-green-700 ring-offset-2">
        <div className="text-sm">{props.symbol}</div>
        <div className="font-actor font-bold truncate text-lg">${Number((Number(props.amount) / Math.pow(10, props.decimal)) * parseFloat(props.priceInUSD)).toFixed(3)}</div>
    </div>
}

export default CoinInfo