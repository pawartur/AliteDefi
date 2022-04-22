export type Transaction = {
    timeStamp: number;
    transactionIndex: number;
    from: string;
    to: string;
    value: number;
    gas: number;
    gasUsed: number;
    gasPrice: number;
    isError: boolean;
    contractAddress: string;
};

export {}

// "blockNumber":"0",
// "timeStamp":"1438269973",
// "hash":"GENESIS_ddbd2b932c763ba5b1b7ae3b362eac3e8d40121a",
// "nonce":"",
// "blockHash":"",
// "transactionIndex":"0",
// "from":"GENESIS",
// "to":"0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a",
// "value":"10000000000000000000000",
// "gas":"0",
// "gasPrice":"0",
// "isError":"0",
// "txreceipt_status":"",
// "input":"",
// "contractAddress":"",
// "cumulativeGasUsed":"0",
// "gasUsed":"0",
// "confirmations":"12698061"
