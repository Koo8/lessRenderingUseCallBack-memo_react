import React from 'react';
import './App.css';

const URL = 'http://hn.algolia.com/api/v1/';
const SEARCH = 'search';
const QUERY = '?query=';
const DEAFULT_SEARCH = 'java';
const PAGE = '&page=';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchTerm: DEAFULT_SEARCH,
      isLoading: false,
      isError: null,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.fetchData(this.state.searchTerm);
    this.setState({ isLoading: false });
  }

  onSearchSubmit = (e) => {
    e.preventDefault(); // the default event is 'submit'
    const term = document.getElementById('search').value; // TODO: the book used <value> and const {searchTerm} = this.state for fetching the 'term' on P111
    !this.needfetch(term) ? this.fetchData(term) : this.getFromCache(term);
  };

  needfetch = (term) => {
    return term in this.state.results;
  };

  getFromCache = (term) => {
    this.setState({ searchTerm: term });
  };
  fetchData = (term, pg = 0) => {
    console.log(`in fetching... ${term} is searching`);
    fetch(`${URL}${SEARCH}${QUERY}${term}${PAGE}${pg}`)
      .then((response) => {
        if (response.ok) {
          // console.log(`response is ok.`);
          return response.json();
        } else {
          console.log(`there are ERRORs.`);
          throw new Error('Something went wrong... Can not get the list.'); // for 404 error
        }
      })
      .then((data) => {
        // console.log(data);
        this.setSearchTopStories(data, term);
      })
      .catch((error) => this.setState({ isError: error, isLoading: false }));
  };

  // pick out this part for pagination to show more listings and still show only 20 initially when do search.
  setSearchTopStories = (data, term) => {
    const { hits, page } = data; // before setState, result is not local state result yet.
    // const { results, searchTerm } = this.state;
    console.log(
      `in setSearchTopStories, searchterm is ${term}, page is ${page}`
    );

    // const oldHits = this.getOldHits(page, term);
    const oldHits =
      page === 0
        ? []
        : (this.state.results &&
            this.state.results[term] &&
            this.state.results[term].hits) ||
          [];
    console.log(`oldHits are `);
    console.log(oldHits);
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: { ...this.state.results, [term]: { hits: updatedHits, page } }, // [term] is the variable format, without [] not working
      searchTerm: term,
    });
  };

  removeItem = (id, term) => {
    const { page } = this.state.results[term];
    // console.log(id);
    // console.log(this.state.result.hits.length); //20
    const updatedHits = this.state.results[term].hits.filter(
      (item) => item.objectID !== id
    );
    // console.log(updatedHits.length); //19
    this.setState({
      results: { ...this.state.results, [term]: { hits: updatedHits, page } }, // spread operator
    });
  };

  render() {
    const { results, searchTerm, isLoading, isError } = this.state;
    const page =
      (results && results[searchTerm] && results[searchTerm].page) || 0;

    if (isError) {
      return <p>Error {isError.message}</p>;
    }
    if (isLoading) {
      return <p>Loading...</p>;
    }

    return (
      <>
        <div className='main'>
          <h2>Search Hacker News: </h2>
          <form>
            <input
              id='search'
              // value={searchTerm}
              // onChange={this.searchChange}
            />
            <Button onClick={this.onSearchSubmit}>Do Search</Button>
          </form>

          {results && results[searchTerm] && (
            <div>
              <h2>
                Result of '{searchTerm}' has {results[searchTerm].hits.length}{' '}
                listings:
              </h2>
              <div className='row'>
                <span className='bold'>Title</span>
                <span className='bold'>Author</span>
                <span className='bold'>ID</span>
                <span></span>
              </div>
              <Table
                term={searchTerm}
                list={results[searchTerm]}
                removeItem={this.removeItem}
              />
            </div>
          )}
          <div style={{ marginTop: 20 }}>
            <Button onClick={() => this.fetchData(searchTerm, page + 1)}>
              More Results
            </Button>
          </div>

          <div>
            <a href=''>Source Code on Github</a>
          </div>
        </div>
      </>
    );
  }
}

const Table = ({ term, list, removeItem }) => {
  // console.log(list.hits.length);
  return (
    <>
      {list.hits.map((item) => {
        return (
          <div key={item.objectID} className='row'>
            <span className='title'>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author} </span>
            <span>{item.objectID}</span>
            <Button onClick={() => removeItem(item.objectID, term)}>
              Dismiss
            </Button>
          </div>
        );
      })}
      <h2>Retrieved {list.page + 1} page from Hacker News</h2>
    </>
  );
};

const Button = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};

export default App;
