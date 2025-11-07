const { useState, useEffect } = React;

function App() {
  const [form, setForm] = useState({
    name: "",
    request_type: "Replacement",
    laptop_model: "HP EliteBook 840",
    justification: "",
    accessories: [],
    needed_by: ""
  });
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/requests")
      .then(res => res.json())
      .then(setRequests);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:5000/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => alert(data.message));
  };

  const handleApproval = (id) => {
    fetch(`http://127.0.0.1:5000/api/approve/${id}`, { method: "POST" })
      .then(() => alert("Request approved"));
  };

  const handleCompletion = (id) => {
    fetch(`http://127.0.0.1:5000/api/complete/${id}`, { method: "POST" })
      .then(() => alert("Request marked as completed"));
  };

  return (
    <div className="container">
      <h2>💻 Laptop Request Form</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Your Name" required
               onChange={e => setForm({...form, name: e.target.value})}/>
        <select onChange={e => setForm({...form, request_type: e.target.value})}>
          <option>Replacement</option>
          <option>New</option>
        </select>
        <select onChange={e => setForm({...form, laptop_model: e.target.value})}>
          <option>HP EliteBook 840</option>
          <option>Dell Latitude 5420</option>
          <option>Lenovo ThinkPad T14</option>
        </select>
        <textarea placeholder="Justification" required
                  onChange={e => setForm({...form, justification: e.target.value})}/>
        <input type="date" onChange={e => setForm({...form, needed_by: e.target.value})}/>
        <button type="submit">Submit Request</button>
      </form>

      <h3>🗂 Submitted Requests</h3>
      {requests.map(r => (
        <div key={r.id}>
          <p><strong>{r.name}</strong> — {r.status}</p>
          {r.status === "Pending Manager Approval" && 
            <button onClick={() => handleApproval(r.id)}>Approve</button>}
          {r.status === "Approved - Sent to IT Fulfillment" && 
            <button onClick={() => handleCompletion(r.id)}>Mark Completed</button>}
          <hr/>
        </div>
      ))}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
