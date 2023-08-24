import React, { useEffect, useState } from 'react';

const Contract = ({ contractInstance, accounts }) => {
  const [isMarried, setIsMarried] = useState(null);

  useEffect(() => {
    const checkMarriageStatus = async () => {
      try {
        const result = await contractInstance.methods.estMarie().call();
        setIsMarried(result);
      } catch (error) {
        console.error('Error checking marriage status:', error);
      }
    };

    if (contractInstance) {
      checkMarriageStatus();
    }
  }, [contractInstance]);

  const demanderMariage = async () => {
    try {
      await contractInstance.methods.demanderMariage(accounts[0]).send({ from: accounts[0] });
      setIsMarried(true);
    } catch (error) {
      console.error('Error demanding marriage:', error);
    }
  };

  const demanderDivorce = async () => {
    try {
      await contractInstance.methods.demanderDivorce().send({ from: accounts[0] });
      setIsMarried(false);
    } catch (error) {
      console.error('Error demanding divorce:', error);
    }
  };

  return (
    <div className="Contract">
      <h2>Contract Details</h2>
      <p>Conjoint principale : {accounts[0]}</p>
      <p>Married: {isMarried !== null ? (isMarried ? "Yes" : "No") : "Loading..."}</p>
      {isMarried !== null && (
        <div>
          {isMarried ? (
            <button onClick={demanderDivorce}>Divorce</button>
          ) : (
            <button onClick={demanderMariage}>Get Married</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Contract;
