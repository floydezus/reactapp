// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './MyList.css';
import axios from 'axios';
import routes from '../routes.js';
import { normalizeDate } from '../utils/date';

// eslint-disable-next-line consistent-return
const MyList = () => {
  const [users, setUsers] = useState(null);
  const [fetchingStatus, setFetchingStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [isAscending, setAscending] = useState(true);
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    setFetchingStatus('loading');
    axios.get(routes.smallData())
      .then((response) => {
        const { data } = response;
        setUsers(data);
        setFetchingStatus('loaded');
      })
      .catch((err) => {
        setError(err);
        setFetchingStatus('failed');
      });

    return () => {
      setFetchingStatus('idle');
    };
  }, []);

  const sortByDate = () => {
    const newUsers = [...users];
    // ascending - по возрастанию,  descending - по убыванию
    setUsers(
      newUsers.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return isAscending ? dateA - dateB : dateB - dateA;
      }),
    );
    setAscending(!isAscending);
  };

  const searchByName = ({ target }) => {
    setNameFilter(target.value);
  };

  const scrollToLast = () => {
    console.log('click');
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };

  const renderList = () => (
      <div className="container">
        <header class="header-page">
          <div class="button-group header-page-button-group">
            <button className="button button-big" onClick={sortByDate}>Sort by: {isAscending? 'Ascending' : 'Descending'}</button>
            <button className="button button-big"
              onClick={scrollToLast}>
              To End
            </button>
          </div>
          <div className="search">
            <label className="search-title" htmlFor="name">Search:</label>
                <input
                  type="text"
                  className="search-control"
                  onChange={searchByName}
                  value={nameFilter}
                  placeholder="First name or last name"
                />
          </div>
        </header>
        <div className="my-list">
        {users.filter((user) => {
          const regexp = new RegExp(nameFilter, 'gi');
          return user.firstName.match(regexp) || user.lastName.match(regexp);
        }).map(
          ({
            id, firstName, lastName, message, timestamp, email, phone,
          }) => (
              <div key={id} className="my-list-item">
                <h2 className="my-list-title">
                  {firstName} {lastName}
                </h2>
                <p>{message}</p>
                <p>{normalizeDate(new Date(timestamp))}</p>
                <div className="my-list-item-hidden-content">
                  <p><a href={`tel:${phone}`}>Phone: {phone}</a></p>
                  <p><a href={`mailto:${email}`}>E-mail: {email}</a></p>
                </div>
              </div>
          ),
        )}
      </div>
      </div>
  );

  if (fetchingStatus === 'idle') {
    return <div className="loading"/>;
  }

  if (fetchingStatus === 'loading') {
    return <div className="loading"/>;
  }

  if (fetchingStatus === 'failed') {
    const errorMessage = error?.message || "Can't load data!";
    return <div className="error">Error | {errorMessage}</div>;
  }

  if (fetchingStatus === 'loaded') {
    return renderList();
  }
};
export default MyList;
