import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';

export function Todo() {
  const [input, setinput] = useState("");
  const [Editinput, setEditinput] = useState("");
  const [Fulldata, setFulldata] = useState(() => {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  });
  const [FilteredData, setFilteredData] = useState(() => {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  });
  const [Tag, setTag] = useState("Work");
  const [checkID, setcheckID] = useState(null);

  let Filterbtn = ["All", "Work", "Personal"];

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(Fulldata));
  }, [Fulldata]);

  function handleSubmit() {
    if (input.trim().length > 0) {
      let data = {
        id: Date.now(),
        todo: input.trim(),
        Tags: Tag,
        Completed: false,
      };
      setFulldata((prev) => [...prev, data]);
      setFilteredData((prev) => [...prev, data]);
      setTag("Work");
      setinput("");
    } else {
      toast.warn("Field is blank. Enter some text...");
    }
  }

  function handleDelete(id) {
    const updated = Fulldata.filter((item) => item.id !== id);
    setFulldata(updated);
    setFilteredData(updated);
  }

  function handleCheck(id) {
    const updated = Fulldata.map((item) =>
      item.id === id ? { ...item, Completed: !item.Completed } : item
    );
    setFulldata(updated);
    setFilteredData(updated);
  }

  function handleEdit(status) {
    if (status === "All") {
      setFilteredData(Fulldata);
    } else {
      const filtered = Fulldata.filter((item) => item.Tags === status);
      setFilteredData(filtered);
    }
  }

  function handleEditInput(id ,todo) {
    if (checkID === id) {
      const updated = Fulldata.map((item) =>
        item.id === id ? { ...item, todo: Editinput } : item
      );
      setFulldata(updated);
      setFilteredData(updated);
      setEditinput("");
      setcheckID(null);
    } else {
      setcheckID(id);
      setEditinput( todo );
    }
  }

  return (
    <div className='h-screen bg-gray-300 flex items-center justify-center'>
      <ToastContainer />
      <div className='h-[80%] w-[50%] bg-white rounded-2xl flex items-center pt-10 flex-col overflow-hidden'>
        <h1 className='text-4xl font-semibold mb-8 xl:text-5xl'>ToDo App with Filter Tags</h1>
        <div className='h-10 w-full px-10 flex items-center justify-center gap-3'>
          <input value={input} className='border-2 border-gray-300 rounded w-60 p-1' onChange={(e) => setinput(e.target.value)} type="text" placeholder='Enter Task...' />
          <select value={Tag} onChange={(e) => setTag(e.target.value)} className='border-2 border-gray-300 p-1 rounded text-zinc-400 font-medium'>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
          </select>
          <button onClick={handleSubmit} className='bg-black p-1 px-4 text-white rounded font-medium'>ADD</button>
        </div>

        <div className='h-fit w-full flex items-center justify-center gap-5 mt-3'>
          {Filterbtn.map((item, i) => (
            <button key={i} onClick={() => handleEdit(item)} className='bg-black p-1 px-4 text-white rounded font-medium'>{item}</button>
          ))}
        </div>

        <div className='h-full w-full mt-3 px-10 flex gap-2 flex-col items-center'>
          {FilteredData && FilteredData.map((item) => (
            <div key={item.id} className='flex items-center justify-between h-10 w-full border border-zinc-200 rounded-lg py-6 px-5 bg-gray-50'>
              <div className='flex gap-3'>
                <input checked={item.Completed} onChange={() => handleCheck(item.id)} type="checkbox" />
                {checkID === item.id ? (
                  <input className='border-2 border-zinc-300 rounded px-2' value={Editinput} onChange={(e) => setEditinput(e.target.value)} />
                ) : (
                  <h4 className='text-lg font-medium'>{item.todo}</h4>
                )}
                <button onClick={() => handleEditInput(item.id,item.todo)} className='text-zinc-200 text-lg bg-black rounded-lg h-7 w-6 font-semibold'>+</button>
              </div>
              <div className='flex gap-7 items-center'>
                <h5 className={`${item.Tags === "Work" ? "bg-green-400" : "bg-yellow-300"} px-3 py-0.5 rounded-2xl text-white font-medium`}>{item.Tags}</h5>
                <button onClick={() => handleDelete(item.id)} className='border-2 bg-zinc-400 border-zinc-500 text-white px-3 py-1 rounded font-medium hover:bg-black hover:text-white hover:border-none'>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

