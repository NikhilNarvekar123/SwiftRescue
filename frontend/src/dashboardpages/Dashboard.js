import DashboardHeader from './components/DashboardHeader';
import { db } from "../firebase";
import { useState } from 'react';

function Dashboard() {

    const addTodo = async (e) => {
        e.preventDefault();  
       
        // try {
        //     const docRef = await addDoc(collection(db, "todos"), {
        //       todo: "hi",    
        //     });
        //     console.log("Document written with ID: ", docRef.id);
        //   } catch (e) {
        //     console.error("Error adding document: ", e);
        //   }
    }

  return (
    <div className="App">
        <DashboardHeader/>
      <h1>Hello</h1>
      <button onClick={addTodo}>Default</button>;
    </div>
  );
}

export default Dashboard;
