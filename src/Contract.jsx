import React, { useEffect, useState } from 'react';

const Contract = ({ contractInstance, accounts }) => {
  const [isMarried, setIsMarried] = useState(null);
  const [newChildAddress, setNewChildAddress] = useState("");
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    const checkMarriageStatus = async () => {
      try {
        const result = await contractInstance.methods.estMarie().call();
        setIsMarried(result);
      } catch (error) {
        console.error('Error checking marriage status:', error);
      }
    };

    const fetchChildren = async () => {
      try {
        const childAddresses = await contractInstance.methods.getEnfants().call();
        setChildren(childAddresses);
      } catch (error) {
        console.error('Error fetching children:', error);
      }
    };

    if (contractInstance) {
      checkMarriageStatus();
      fetchChildren();
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

  const handleAddChild = async () => {
    try {
      await contractInstance.methods.ajouterEnfant(newChildAddress).send({ from: accounts[0] });
      const newChildren = await contractInstance.methods.getEnfants().call();
      setChildren(newChildren);
      setNewChildAddress("");
    } catch (error) {
      console.error('Error adding child:', error);
    }
  };

  const handleInherit = async () => {
    if (selectedChild) {
      try {
        await contractInstance.methods.heriterEnfant(selectedChild).send({ from: accounts[0] });
        const newChildren = await contractInstance.methods.getEnfants().call();
        setChildren(newChildren);
        setSelectedChild(null);
      } catch (error) {
        console.error('Error inheriting child:', error);
      }
    }
  };

  return (
    <div className="Contract">
      <h2>Contract Details</h2>
      <p>Vous : {accounts[0]}</p>
      <p>Situation actuelle : {isMarried !== null ? (isMarried ? " Marié(e) " : " Divorcé(e) ") : "Loading..."}</p>
      {isMarried !== null && (
        <div>
          {isMarried ? (
            <button onClick={demanderDivorce}>- DIVORCE - </button>
          ) : (
            <button onClick={demanderMariage}>- MARIAGE -</button>
          )}
        </div>
      )}

      <div className="ButtonsContainer">
        
        <div>
          <input
            type="text"
            placeholder="Adresse Ethereum de l'enfant"
            value={newChildAddress}
            onChange={(e) => setNewChildAddress(e.target.value)}
          />
          <button onClick={handleAddChild}>Ajouter un enfant</button><button onClick={handleInherit}>Héritage</button>
        </div>
      </div>

      {selectedChild && (
        <p>Hériter l'enfant sélectionné</p>
      )}

      {children.length > 0 && (
        <div>
          <h3>Liste des enfants:</h3>
          <ul>
            {children.map((child) => (
              <li key={child}>
                Adresse: {child}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Contract;
