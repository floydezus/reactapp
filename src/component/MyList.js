import React, { useState, useEffect } from 'react';
import './MyList.css';
import axios from 'axios';
import routes from '../routes.js';

const MyList = () => {
  const [users, setUsers] = useState( null);
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

  const getDate = (timest) => {
    const date = new Date(timest);
    Date.prototype.formatMMDDYYYY = function(){
      return (this.getMonth() + 1) + 
      "/" +  this.getDate() +
      "/" +  this.getFullYear();
    }
    return date.formatMMDDYYYY();
  }

  const searchByName = ({ target }) => {
    console.log('valeuvt', target.value);
    setNameFilter(target.value);
    if (target.value === '') {
      return;
    } else {
        const filteredUsers = users.original.filter((user) => {
        return user.firstName.toLowerCase().includes(target.value);
      })
      setUsers({original: user.original, filtered:filteredUsers });
    }    
    // const filteredUsers = users.filter((user) => {
    //   return user.firstName.toLowerCase().includes(target.value);
    // })
    // setUsers(filteredUsers);
  }

  const renderList = () => {    
    return (
      <div>        
        <button className="button" onClick={sortByDate}>Sort by: {isAscending? 'Ascending' : 'Descending'}</button>
        <label htmlFor="name">First Name:</label>
            <input
              type="text"
              className="form-control"
              onChange={searchByName}
              value={nameFilter}
              placeholder="Search people by name..."
            /> 
        <div className="list">
        {users?.map(
          ({
            id, firstName, lastName, message, timestamp, email, phone,
          }) => (
              <div key={id} className="list-item">
                <h2 className="list-title">
                  {firstName} {lastName}
                </h2>
                <p>{message}</p>
                <p>{getDate(timestamp)}</p>
                <div className="list-item-hidden-content">
                  <p><a href={`tel:${phone}`}>Phone: {phone}</a></p>
                  <p><a href={`mailto:${email}`}>E-mail: {email}</a></p>
                </div>
              </div>
          ),
        )}
      </div>
      </div>
    );
  };

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
