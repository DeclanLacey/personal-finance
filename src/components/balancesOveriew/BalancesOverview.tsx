import { useEffect, useState } from 'react'
import { currencyFormatCents } from '../../utils/utils'
import { getBalances } from '../../utils/clientCalls'
import "./BalancesOverview.css"

export default function BalancesOverview() {
  const [balanceData, setBalanceData] = useState<any[] | undefined>() 
  const [loading, setLoading] = useState<Boolean>(false)

  useEffect(() => {
    //// Calls utility functions to get the data from the backend
    async function getData() {
      try {
        setLoading(true)
        const data = await getBalances()
        setBalanceData(data)
        setLoading(false)
      }catch(error){
        setLoading(false)
        console.log(error)
      }
    }
    getData()
  }, [])

  //// Checks if loading is true
  if (loading) {
    return <div></div>
  }

  //// Checks if the balanceData state is falsey
  if (!balanceData) {
    return <div></div>
  }

  /////// You need to write logic to calculate the current balances based off of the data
  ////// You should write this logic elsewhere, for example when a transaction is added, it should either add to the income total or the expenses total
  
  return (
    <section className='balances_overview-container'>
      <div className='balances_overview-amount-container grey-background'>
        <h2 className='balances_overview-type'>Current Balance</h2>
        <p className='balances_overview-amount'>{balanceData.length > 0 ? currencyFormatCents(balanceData[0]?.current) : currencyFormatCents(0)}</p>
      </div>

      <div className='balances_overview-amount-container'>
        <h2 className='balances_overview-type'>Income</h2>
          <p className='balances_overview-amount'>{balanceData.length > 0 ? currencyFormatCents(balanceData[0]?.income) : currencyFormatCents(0)}</p>
      </div>

      <div className='balances_overview-amount-container'>
        <h2 className='balances_overview-type'>Expenses</h2>
        <p className='balances_overview-amount'>{balanceData.length > 0 ? currencyFormatCents(balanceData[0]?.expenses) : currencyFormatCents(0)}</p>
      </div>
    </section>
  )
}
