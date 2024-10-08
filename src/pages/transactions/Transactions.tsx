import React, { useEffect, useState } from 'react'
import Nav from '../../components/nav/Nav'
import { CiSearch } from "react-icons/ci";
import "./Transactions.css"
import { getCategoryNamesFromBudgets, getTransactions } from '../../utils/clientCalls';
import { currencyFormatCents, formatDate } from '../../utils/utils';
import ReactPaginate from 'react-paginate';
import { Transaction } from '../../types/types';



export default function Transactions() {
  const [categoryNames, setCategoryNames] = useState<String[]>()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [sortBySelection, setSortBySelection] = useState<String>("latest")
  const [filterBySelection, setFilterBySelection] = useState<String>("")
  const [currentSearch, setCurrentSearch] = useState<String>("")
  const [loading, setLoading] = useState<Boolean>(false)

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true)
        const categoryNameData : String[] | undefined = await getCategoryNamesFromBudgets()
        //// This line below gives an error when you try to use the type of Transaction[]
        const transactionData : any = await getTransactions()
        setCategoryNames(categoryNameData)
        setTransactions(transactionData)
        setLoading(false)
      }catch(error) {
        setLoading(false)
        console.log(error)
      }
    }
    getData()
  }, [])


   /// Checks if the data is currently loading
   if (loading) {
    return <div></div>
  }

  //// Checks if the budgets or transactions are falsey values
  if (!categoryNames && !transactions) {
    return <div></div>
  }

  function renderCategoryNameOptions() {
    const categoryNameElements = categoryNames?.map((category, index) => {
      return (
        <option key={index} value={category.toLowerCase()}>{category}</option>
      )
    })
    
    return categoryNameElements
  }

  function filterAndSortData() : Transaction[] {
    let selectedTransactions: Transaction[] = transactions 

    function filterTransactions() {
      if (filterBySelection) {
        selectedTransactions = selectedTransactions?.filter((transaction) => (transaction.category).toLowerCase() === filterBySelection)
      }
    }

    function sortTransactions() {
      switch (sortBySelection) {
        case "latest":
          selectedTransactions = selectedTransactions?.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
          break;
        case "oldest":
          selectedTransactions = selectedTransactions?.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());
          break;
        case "a-z":
          selectedTransactions = selectedTransactions?.sort((a, b) => {
            if (a.name < b.name) return -1
            if (a.name > b.name) return 1
            return 0
          })
          break;
        case "z-a":
          selectedTransactions = selectedTransactions?.sort((a, b) => {
            if (a.name > b.name) return -1
            if (a.name < b.name) return 1
            return 0
          })
          break;
        case "highest":
          selectedTransactions = selectedTransactions?.sort((a, b) => {
            if (a.amount < b.amount) return -1
            if (a.amount > b.amount) return 1
            return 0
          })
          break;
        case "lowest":
          selectedTransactions = selectedTransactions?.sort((a, b) => {
            if (a.amount > b.amount) return -1
            if (a.amount < b.amount) return 1
            return 0
          })
          break;
      }
    } 

    function filterTransactionsBySearch() {
      selectedTransactions = selectedTransactions?.filter((transaction) => (transaction.name).toLowerCase().includes(currentSearch.toLowerCase()))
    }

    filterTransactions()
    sortTransactions()
    filterTransactionsBySearch()

    return selectedTransactions
  }

  function renderTransactions(currentTransactions: Transaction[]) {
    const transactionElements = currentTransactions?.map((transaction, index) => {
      let positiveTransactionClassName = ""
      if (transaction.amount > 0) positiveTransactionClassName = "transaction-positive"

      return (
        <div className='transaction-container' key={index}>
          <img className='transaction-img' src={`${transaction.avatar}`}/>

          <div>
            <p className='transaction-name'>{transaction.name}</p>
            <p className='transaction-category'>{transaction.category}</p>
          </div>

          <div className='transaction-amount-date-container'>
            <p className={`transaction-amount ${positiveTransactionClassName}`}>{currencyFormatCents(transaction.amount)}</p>
            <p className='transaction-date'>{formatDate(transaction.date)}</p>
          </div>
        </div>
      )
    })
    
    if (transactionElements.length === 0) {
      return (
        <div className='transactions-no-results-container'>
          <p className='transactions-no-results-text'>No matching transactions found</p>
        </div>
      )
    }else {
      return transactionElements
    }
  }

  function changeFilter(event: { target: { value: React.SetStateAction<string>; }; }) {
    setFilterBySelection((event.target.value).toString())
  }

  function changeSort(event: { target: { value: React.SetStateAction<string>; }; }) {
    setSortBySelection((event.target.value).toString())
  }

  function changeSearchInput(event: { target: { value: React.SetStateAction<string>; }; }) {
    setCurrentSearch((event.target.value).toString())
  }

  /// You need to figure out the type for the itemsPerPage, before it was {itemsPerPage}, but gave an error
  function PaginatedItems({itemsPerPage}: any) {
    const sortedAndFilteredTransactions : Transaction[] = filterAndSortData() 
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);
  
    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = sortedAndFilteredTransactions?.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(sortedAndFilteredTransactions.length / itemsPerPage);
  
    // Invoke when user click to request another page.
    const handlePageClick = (event: { selected: number; }) => {
      const newOffset = (event.selected * itemsPerPage) % sortedAndFilteredTransactions.length;
      setItemOffset(newOffset);
    };
  
    return (
      <>
        {renderTransactions(currentItems)}
        <ReactPaginate
          activeClassName={'active-item'}
          breakClassName={'pagination-item break-me'}
          breakLabel={'...'}
          disabledClassName={'disabled-page'}
          containerClassName={'pagination'}
          marginPagesDisplayed={2}
          pageClassName={'pagination-page'}
          nextClassName={"next "}
          nextLabel={<img src='./assets/icon-caret-right.svg' />}
          onPageChange={handlePageClick}
          pageCount={pageCount}
          pageRangeDisplayed={2}
          pageLinkClassName={"pagination-item"}
          previousClassName={"previous"}
          previousLabel={<img src='./assets/icon-caret-left.svg'/>}
          previousLinkClassName={'nextOrPreviousLink'}
          nextLinkClassName={'nextOrPreviousLink'}
        />
      </>
    );
  }

  return (
    <div className='transactions-page-container'>
      <h1 className='transactions-title'>Transactions</h1>
      <section className='transactions-content-container'>
        <form className='transactions-form'>
          <div className='transactions-search-bar-container'>
            <input placeholder='Search Transaction' className='transactions-search-bar' onChange={changeSearchInput} type='text' />
            <CiSearch className='transactions-search-bar-icon' />
          </div>

          <div className='transactions-select-inputs-container'>
            <div className='transactions-sort-select-container'>
              <label className='transactions-select-label'>Sort by</label>
              <select className='transactions-sort-select' name='sort' onChange={changeSort}>
                <option className='transactions-sort-option' value="latest">Latest</option>
                <option className='transactions-sort-option' value="oldest">Oldest</option>
                <option className='transactions-sort-option' value="a-z">A to Z</option>
                <option className='transactions-sort-option' value="z-a">Z to A</option>
                <option className='transactions-sort-option' value="highest">Highest</option>
                <option className='transactions-sort-option' value="lowest">Lowest</option>
              </select>
            </div>

            <div className='transactions-filter-select-container'>
              <label className='transactions-select-label'>Category</label>
              <select className='transactions-filter-select' name="filter" onChange={changeFilter}>
                <option className='transactions-filter-option' value=""> All Transactions</option>
                {renderCategoryNameOptions()}
              </select>
            </div>
          </div>
          
        </form>
        <div className='transactions-paginate-container'>
          <PaginatedItems  itemsPerPage={10}/>
        </div>
      </section>
    </div>
  )
}
