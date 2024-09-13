import React, { useState } from 'react';
import './App.css';

const schemaOptions = [
  { label: 'First Name', value: 'first_name' },
  { label: 'Last Name', value: 'last_name' },
  { label: 'Gender', value: 'gender' },
  { label: 'Age', value: 'age' },
  { label: 'Account Name', value: 'account_name' },
  { label: 'City', value: 'city' },
  { label: 'State', value: 'state' },
];

const Segment = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [dropdowns, setDropdowns] = useState([]);
//Webhook is asking for Premium so i have used below website which serves same functionality
  const webhookUrl = 'https://f356535d37eeb5ff91374e35b1380c1d.m.pipedream.net'; 

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  const handleSchemaChange = (index, value) => {
    const updatedSchemas = [...selectedSchemas];
    updatedSchemas[index] = value;
    setSelectedSchemas(updatedSchemas);
  };

  const addNewSchema = () => {
    setDropdowns([...dropdowns, '']);
  };

  const handleSaveSegment = async () => {
    const schema = selectedSchemas.map(value => {
      const schemaOption = schemaOptions.find(option => option.value === value);
      return { [value]: schemaOption.label };
    });

    const data = {
      segment_name: segmentName,
      schema,
    };

    console.log('Data to send to server:', data);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Data successfully sent to server');
      } else {
        console.error('Failed to send data to server');
      }
    } catch (error) {
      console.error('Error sending data to server:', error);
    }

    setIsPopupOpen(false);
    setSegmentName('');
    setSelectedSchemas([]);
    setDropdowns([]);
  };

  const getAvailableOptions = (index) => {
    const usedValues = selectedSchemas.filter((_, i) => i !== index);
    return schemaOptions.filter(option => !usedValues.includes(option.value));
  };

  return (
    <div className="App">
      <button onClick={togglePopup}>Save segment</button>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Save Segment</h2>
            <input
              type="text"
              placeholder="Segment Name"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />
            {dropdowns.map((_, index) => (
              <select
                key={index}
                value={selectedSchemas[index] || ''}
                onChange={(e) => handleSchemaChange(index, e.target.value)}
              >
                <option value="">Select schema</option>
                {getAvailableOptions(index).map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
            <select
              value={dropdowns.length > 0 ? dropdowns[dropdowns.length - 1] : ''}
              onChange={(e) => {
                if (e.target.value) {
                  handleSchemaChange(dropdowns.length - 1, e.target.value);
                  addNewSchema();
                }
              }}
            >
              <option value="">Add schema to segment</option>
              {getAvailableOptions(dropdowns.length - 1).map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button onClick={addNewSchema}>+ Add new schema</button>
            <button onClick={handleSaveSegment}>Save segment</button>
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Segment;
