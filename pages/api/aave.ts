import { BigNumber } from 'ethers';

// https://app.aave.com/markets/?marketName=proto_polygon
// All queries against polygon V2
// {
//     reserves(where: {symbol_in: ["USDC", "DAI", "USDT"]}) {
//       id
//       symbol
//       name
//       decimals
//       underlyingAsset
//       usageAsCollateralEnabled
//       reserveFactor
//       baseLTVasCollateral
//       averageStableRate
//       stableDebtLastUpdateTimestamp
//       liquidityIndex
//       reserveLiquidationThreshold
//       reserveLiquidationBonus
//       variableBorrowIndex
//       variableBorrowRate
//       liquidityRate
//       totalPrincipalStableDebt
//       totalScaledVariableDebt
//       lastUpdateTimestamp
//       availableLiquidity
//       stableBorrowRate
//       totalLiquidity
//       price {
//         priceInEth
//       }
//     }
//   }

const queryResult = 
    {
        "data": {
          "reserves": [
            {
              "id": "0x2791bca1f2de4661ed88a30c99a7a9449aa841740xd05e3e715d945b59290df0ae8ef85c1bdb684744",
              "symbol": "USDC",
              "name": "USD Coin (PoS)",
              "decimals": 6,
              "underlyingAsset": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
              "usageAsCollateralEnabled": true,
              "reserveFactor": "1000",
              "baseLTVasCollateral": "8000",
              "averageStableRate": "0",
              "stableDebtLastUpdateTimestamp": 0,
              "liquidityIndex": "1033942919776805497126617460",
              "reserveLiquidationThreshold": "8500",
              "reserveLiquidationBonus": "10500",
              "variableBorrowIndex": "1044902797735648687542861983",
              "variableBorrowRate": "33834622561878318233114538",
              "liquidityRate": "23181829099071497943305536",
              "totalPrincipalStableDebt": "0",
              "totalScaledVariableDebt": "165505931702605",
              "lastUpdateTimestamp": 1650673078,
              "availableLiquidity": "56103188295199",
              "stableBorrowRate": "55917311280939159116557269",
              "totalLiquidity": "193414827873609",
              "price": {
                "priceInEth": "337000603692993"
              }
            },
            {
              "id": "0x8f3cf7ad23cd3cadbd9735aff958023239c6a0630xd05e3e715d945b59290df0ae8ef85c1bdb684744",
              "symbol": "DAI",
              "name": "(PoS) Dai Stablecoin",
              "decimals": 18,
              "underlyingAsset": "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
              "usageAsCollateralEnabled": true,
              "reserveFactor": "1000",
              "baseLTVasCollateral": "7500",
              "averageStableRate": "0",
              "stableDebtLastUpdateTimestamp": 0,
              "liquidityIndex": "1038424919776655084171113356",
              "reserveLiquidationThreshold": "8000",
              "reserveLiquidationBonus": "10500",
              "variableBorrowIndex": "1054952014188230700248370925",
              "variableBorrowRate": "26697135351358756613810790",
              "liquidityRate": "12829266647437849937191348",
              "totalPrincipalStableDebt": "0",
              "totalScaledVariableDebt": "57442191743976919145393266",
              "lastUpdateTimestamp": 1650672912,
              "availableLiquidity": "52684415083617689299526261",
              "stableBorrowRate": "52348567675679378306905395",
              "totalLiquidity": "80682924282040120260925578",
              "price": {
                "priceInEth": "337323509789286"
              }
            },
            {
              "id": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f0xd05e3e715d945b59290df0ae8ef85c1bdb684744",
              "symbol": "USDT",
              "name": "(PoS) Tether USD",
              "decimals": 6,
              "underlyingAsset": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
              "usageAsCollateralEnabled": false,
              "reserveFactor": "1000",
              "baseLTVasCollateral": "0",
              "averageStableRate": "0",
              "stableDebtLastUpdateTimestamp": 0,
              "liquidityIndex": "1067811994898014803858253097",
              "reserveLiquidationThreshold": "0",
              "reserveLiquidationBonus": "0",
              "variableBorrowIndex": "1083492326566132653492552195",
              "variableBorrowRate": "39705386090417796803706830",
              "liquidityRate": "31924483112930146861661658",
              "totalPrincipalStableDebt": "0",
              "totalScaledVariableDebt": "53400171348975",
              "lastUpdateTimestamp": 1650672846,
              "availableLiquidity": "5639654203624",
              "stableBorrowRate": "54852693045208898401853415",
              "totalLiquidity": "50973515370268",
              "price": {
                "priceInEth": "337021691138314"
              }
            }
          ]
        }
}

const reserves = queryResult.data.reserves.map(reserve => {
    return {
        ...reserve,
        priceInMarketReferenceCurrency: reserve.price.priceInEth,
        eModeCategoryId: 0,
        borrowCap: '',
        supplyCap: '',
        debtCeiling: '',
        debtCeilingDecimals: 0,
        isolationModeTotalDebt: '',
        eModeLtv: 0,
        eModeLiquidationThreshold: 0,
        eModeLiquidationBonus: 0,
    };
});

/// Below is taking reserves and formatting everything

import { formatReserves } from '@aave/math-utils';
import dayjs from 'dayjs';

// reserves input from Fetching Protocol Data section

const reservesArray = reserves;
// {
//     priceOracles {
//       usdPriceEth
//     }
//   }
// }
const baseCurrencyData = {
    "data": {
        "priceOracles": [
            {
                "usdPriceEth": "333019185235261"
            }
        ]
    }
}

const currentTimestamp = dayjs().unix();

/*
- @param `reserves` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.reservesArray`
- @param `currentTimestamp` Current UNIX timestamp in seconds
- @param `marketReferencePriceInUsd` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferencePriceInUsd`
- @param `marketReferenceCurrencyDecimals` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferenceCurrencyDecimals`
*/

// Docs: https://github.com/aave/aave-utilities#subgraph
const formattedPoolReserves = formatReserves({
    reserves: reservesArray,
    currentTimestamp,
    marketReferenceCurrencyDecimals: 18,
    marketReferencePriceInUsd: (1 / (parseInt(baseCurrencyData.data.priceOracles[0].usdPriceEth) / (10 ** 18))).toString(),
});

export default formattedPoolReserves;