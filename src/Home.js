import logo from "./assets/img/logo.svg";
import search from "./assets/img/search.svg";
import person from "./assets/img/person.svg";
import chevron from "./assets/img/chevron.svg";
import closeButton from "./assets/img/close-button.svg";
import bookCoverUnavailable from "./assets/img/book-cover-unavailable.png";
import "./Home.css";
import { useState, useEffect } from "react";

function Home() {
  /**
   * TODO: Coisas para fazer
   * - Refinar o filtro: precisam funcionar combinados e utilizar filtro em cima de referência e caso não tenha nenhum, voltar ao
   * - Paginação
   * - Responsividade
   * - Componentes feitos com Styled Component (no momento estou fazendo na mão)
   * - Documentação
   * - Testes unitários
   */

  const [booksResult, setBooksResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [filterParam, setFilterParam] = useState([]);

  const handleChangeSearch = (event) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    handleSearch(query)
  }, [query])
  
  const handleSearch = (query) => {
    if (query)
      fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=0&maxResults=10`
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then((data) => {
          setIsLoading(true);
          setBooksResult(data.items);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(true);
          console.log("Error fetching data: ", error);
          setError(error);
          setIsLoading(false);
        });
  };

  const handleCheckbox = (event) => {
    if (event.target.checked) {
      setFilterParam([...filterParam, event.target.value]);
    } else {
      setFilterParam(
        filterParam.filter((filterParam) => filterParam !== event.target.value)
      );
    }
  };

  const filterByPrice = (array) => {
    if (filterParam.includes("0-30")) {
      return array.filter((item) => item.saleInfo?.retailPrice?.amount <= 30);
    } else if (filterParam.includes("31-50")) {
      return array.filter(
        (item) =>
          item.saleInfo?.retailPrice?.amount >= 31 &&
          item.saleInfo?.retailPrice?.amount <= 50
      );
    } else if (filterParam.includes("51-100")) {
      return array.filter(
        (item) =>
          item.saleInfo?.retailPrice?.amount >= 51 &&
          item.saleInfo?.retailPrice?.amount <= 100
      );
    } else if (filterParam.includes("+100")) {
      return array.filter((item) => item.saleInfo?.retailPrice?.amount > 100);
    } else {
      return array;
    }
  };

  const filterBySaleability = (array) => {
    if (filterParam.includes("disponivel")) {
      return array.filter((item) => item.saleInfo?.saleability === "FOR_SALE");
    } else if (filterParam.includes("indisponivel")) {
      return array.filter(
        (item) => item.saleInfo?.saleability === "NOT_FOR_SALE"
      );
    } else {
      return array;
    }
  };

  const filterByFormat = (array) => {
    if (filterParam.includes("e-pub")) {
      return array.filter((item) => item.accessInfo?.epub?.isAvailable);
    } else if (filterParam.includes("pdf")) {
      return array.filter((item) => item.accessInfo?.pdf?.isAvailable);
    } else {
      return array;
    }
  };

  useEffect(() => {
    if (booksResult) {
      let result = booksResult;
      result = filterByPrice(result);
      result = filterBySaleability(result);
      result = filterByFormat(result);
      setBooksResult(result);
    }

  }, [filterParam, booksResult]);

  const handleClearFilter = (query) => {
    handleSearch(query);
    setFilterParam([]);
    document
      .querySelectorAll('input[type="checkbox"]')
      .forEach((el) => (el.checked = false));
  };

  return (
    <div className="home">
      <header className="home-header">
        <img src={logo} className="home-logo" alt="logo" />
        <div className="home-input-container">
          <input
            placeholder="Search"
            className="home-input"
            onChange={handleChangeSearch}
            value={query}
          />
          <button onClick={() => handleSearch(query)}>
            <img src={search} alt="search" className="home-input-img" />
          </button>
        </div>
        <div className="home-user">
          <img src={person} alt="person" />
          <p>Alessandra</p>
          <img src={chevron} alt="chevron" />
        </div>
      </header>
      <section className="content">
        <aside className="home-filter-container">
          <h1>Filtrar</h1>
          {filterParam.length ? (
            <button onClick={() => handleClearFilter(query)}>
              Limpar filtro
              <img
                src={closeButton}
                className="close-button"
                alt="close-button"
              />
            </button>
          ) : (
            ""
          )}
          <fieldset>
            <legend>Preço</legend>
            <label for="0-30">
              <input
                type="checkbox"
                id="0-30"
                name="0-30"
                value="0-30"
                onChange={handleCheckbox}
              />
              de R$0 até R$30
            </label>
            <label for="31-50">
              <input
                type="checkbox"
                id="31-50"
                name="31-50"
                value="31-50"
                onChange={handleCheckbox}
              />
              de R$31 até R$50
            </label>
            <label for="51-100">
              <input
                type="checkbox"
                id="51-100"
                name="51-100"
                value="51-100"
                onChange={handleCheckbox}
              />
              de R$51 até R$100
            </label>
            <label for="+100">
              <input
                type="checkbox"
                id="+100"
                name="+100"
                value="+100"
                onChange={handleCheckbox}
              />
              Mais de R$100
            </label>
          </fieldset>
          <fieldset>
            <legend>Disponibilidade para venda</legend>
            <label for="disponivel">
              <input
                type="checkbox"
                id="disponivel"
                name="disponivel"
                value="disponivel"
                onChange={handleCheckbox}
              />
              Disponível
            </label>
            <label for="indisponivel">
              <input
                type="checkbox"
                id="indisponivel"
                name="indisponivel"
                value="indisponivel"
                onChange={handleCheckbox}
              />
              Indisponível
            </label>
          </fieldset>
          <fieldset>
            <legend>Formatos disponíveis</legend>
            <label for="e-pub">
              <input
                type="checkbox"
                id="e-pub"
                name="e-pub"
                value="e-pub"
                onChange={handleCheckbox}
              />
              e-pub
            </label>
            <label for="pdf">
              <input
                type="checkbox"
                id="pdf"
                name="pdf"
                value="pdf"
                onChange={handleCheckbox}
              />
              PDF
            </label>
          </fieldset>
        </aside>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error!</p>
        ) : (
          <section className="home-book-card-container">
            {query && (
              <h1 className="home-book-card-query-result">{`Resultados para "${query}"`}</h1>
            )}
            {booksResult &&
              booksResult.map((item, index) => (
                <div className="home-book-card" key={index}>
                  <img
                    src={item.volumeInfo?.imageLinks?.thumbnail || bookCoverUnavailable}
                    alt="Book thumbnail"
                  />
                  <h1>{item.volumeInfo?.title}</h1>
                  {item.volumeInfo?.authors &&
                    item.volumeInfo?.authors.map((item) => {
                      return <p>{item}</p>;
                    })}
                </div>
              ))}
          </section>
        )}
      </section>
      <footer className="home-footer">
        <p>Copyright © 2021 Árvore. Todos os direitos reservados.</p>
        <div className="home-footer-buttons">
          <button>Política de privacidade</button>
          <button>Ajuda</button>
        </div>
      </footer>
    </div>
  );
}

export default Home;
