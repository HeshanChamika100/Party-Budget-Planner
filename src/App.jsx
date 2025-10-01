import React, { useState } from "react";

function App() {
  const [items, setItems] = useState([
    { name: "Chicken", unitPrice: 1100, quantity: 10 },
    { name: "Seasoning", unitPrice: 380, quantity: 3 },
    { name: "Charcoal", unitPrice: 1000, quantity: 1 },
    { name: "Beverages", unitPrice: 3000, quantity: 1 },
  ]);

  const [people, setPeople] = useState(13);

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === "name" ? value : Number(value);
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", unitPrice: 0, quantity: 1 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const totalCost = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const perPerson = people > 0 ? (totalCost / people).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-center mb-6">🎉 Party Budget Calculator</h1>

        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Item</th>
              <th className="p-2">Unit Price</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Total</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="text-center border-t">
                <td>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handleChange(index, "unitPrice", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleChange(index, "quantity", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="font-semibold">{item.unitPrice * item.quantity}</td>
                <td>
                  <button
                    onClick={() => removeItem(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={addItem}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          ➕ Add Item
        </button>

        <div className="mt-6">
          <label className="font-semibold">Number of People: </label>
          <input
            type="number"
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            className="border p-1 rounded ml-2"
          />
        </div>

        <div className="mt-6 text-lg font-bold">
          <p>Total Cost: {totalCost}</p>
          <p>Cost per Person: {perPerson}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
