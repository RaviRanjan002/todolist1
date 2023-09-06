import React, { useEffect, useState } from 'react';
import CreateTask from '../modals/CreateTask';
import Card from './Card';
import { useDrop } from 'react-dnd';

const TodoList = () => {
  const [modal, setModal] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "todo",
    drop: (item) => addToCompleted(item.id, item.taskName, item.description), // Use addToCompleted here
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  useEffect(() => {
    let arr = localStorage.getItem("taskList");
    if (arr) {
      let obj = JSON.parse(arr);
      setTaskList(obj);
    }
  }, []);

  const addToCompleted = (id, taskName, description) => {
    const moveTask = taskList.find((task) => id === task.id); // Use find instead of filter
    if (moveTask) {
      setCompleted((completed) => [...completed, { ...moveTask, taskName, description }]);
      deleteTask(taskList.indexOf(moveTask)); // Remove the task from the todo list
    }
  }

  const deleteTask = (index) => {
    let tempList = [...taskList]; // Make a copy of the taskList
    tempList.splice(index, 1);
    localStorage.setItem("taskList", JSON.stringify(tempList));
    setTaskList(tempList);
  }

  const updateListArray = (obj, index) => {
    let tempList = [...taskList]; // Make a copy of the taskList
    tempList[index] = obj;
    localStorage.setItem("taskList", JSON.stringify(tempList));
    setTaskList(tempList);
  }

  const toggle = () => {
    setModal(!modal);
  }

  const saveTask = (taskObj) => {
    let tempList = [...taskList]; // Make a copy of the taskList
    tempList.push(taskObj);
    localStorage.setItem("taskList", JSON.stringify(tempList));
    setTaskList(tempList);
    setModal(false);
  }

  return (
    <>
      <div className="header text-center">
        <h3>Todo List</h3>
        <button className="btn btn-primary mt-2" onClick={() => setModal(true)}>Create Task</button>
      </div>
      <div className="task-mid">
        <div className="task-container">
          <h4>Todo:</h4>
          {taskList && taskList.map((obj, index) => <Card key={index} taskObj={obj} index={index} deleteTask={deleteTask} updateListArray={updateListArray} />)}
        </div>
        <div className="task-container" ref={drop}>
          <h4>In Progress:</h4>
          {taskList && completed.map((obj, index) => <Card key={index} taskObj={obj} deleteTask={deleteTask} updateListArray={updateListArray} />)}
        </div>
        <div className="task-container">
          <h4>Done:</h4>
          {completed.map((obj, index) => <Card key={index} taskObj={obj} deleteTask={deleteTask} updateListArray={updateListArray} />)}
        </div>
      </div>
      <CreateTask toggle={toggle} modal={modal} save={saveTask} />
    </>
  );
};

export default TodoList;
