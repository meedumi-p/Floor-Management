import React, { useState } from 'react'
import '../Components/floorplan.css';
import VectorIcon from '../Assets/Vector.svg';
import TableSqr from '../Assets/Table.svg';
import TableCircle from '../Assets/Mid.svg';
import MinusIcon from '../Assets/Button.base (1).svg';
import PlusIcon from '../Assets/Button.base.svg';
import PlusActive from '../Assets/Button.base (2).svg';
import {DragDropContext,Droppable,Draggable} from 'react-beautiful-dnd';
const FloorPlan = () => {
    const [minCovers,setMinCovers]=useState(1);
    const [maxCovers,setMaxCovers]=useState(1);
    const [isOnline,setIsOnline]=useState(false);
    const [isPlusClicked,setIsPlusClicked] = useState(false)
    const [rooms,setRooms] = useState([{id:1,name:'Main Room',tables:[]}])
    const [activeRoom,setActiveRoom]=useState(1);

   
    const handleIncrement = (type)=>{
        if (type === 'min') setMinCovers(minCovers + 1);
        if (type === 'max') setMaxCovers(maxCovers + 1);
        setIsPlusClicked(true);
        setTimeout(() =>setIsPlusClicked(false),3000) ;
    }

    const handleDecrement = (type) => {
        if(type === 'min' && minCovers >1) setMinCovers(minCovers -1);
        if(type === 'max' && maxCovers > 1)setMaxCovers(maxCovers - 1)
    };
   const toggleOnline = ()=> {
    setIsOnline(!isOnline);
   }

   const handleAddRoom = ()=> {
    const newRoomId = rooms.length +1;
    setRooms([...rooms,{id:newRoomId,name:  `room ${newRoomId}`,tables:[]}])
    setActiveRoom(newRoomId);
    }
    
    
    const onDragEnd = (result, roomId) => {
        console.log("Drag result:", result); 
        if (!result.destination) {
            console.log("No destination detected");
            return;
        }
        console.log("Source:", result.source);
        console.log("Destination:", result.destination);
      
        const roomIndex = rooms.findIndex((room) => room.id === roomId);
        if (roomIndex === -1) return;
      
        const updatedRooms = [...rooms];
        const tables = Array.from(updatedRooms[roomIndex].tables);
      
        if (result.source.droppableId === "table-icons") {
          
          const newTable = {
            id: `table-${Date.now()}`, 
            name: `Table ${tables.length + 1}`, 
            type: result.draggableId.includes("circle") ? "circle" : "square", 
          };
          tables.splice(result.destination.index, 0, newTable);
        } else {
          
          const [movedTable] = tables.splice(result.source.index, 1);
          tables.splice(result.destination.index, 0, movedTable);
        }
      
        updatedRooms[roomIndex].tables = tables;
        setRooms(updatedRooms);
      };
   
      
      
  return (
    <div className='Main'>
        <div className="SideNav-bar">
            <img src={VectorIcon} alt='Floor Management icon' className="VectorIcon" />
        </div>
        <div className="Content">
        <h1>Floor Management</h1>
        <hr/>
        <div className='FloorPlan'>
             <div className='Table-Options'>
                <h3 className='h3-text'>Tables</h3>
                <hr />
                <h3>Table Options</h3>
                <p>Drag and drop your tables</p>
                <div className='Table-Item'>
                  <div className='Table-Square'>
                    <img src={TableSqr} alt='table square' className='Table-Square' />
                  </div>
                  <div className='Table-Circle'>
                    <img src={TableCircle} alt='table circle' className='Table-Circle' />
                    </div>
                </div> 
               

                <div className="Table-Details">
                    <div className="Detail-Row">
                   <label>Table Name: </label>
                    <input type='text' placeholder='Enter name'/>
                    </div>
                    <div className="Detail-Row">
                    <label>Min Covers:</label>
                    <div className='Control'>
                        <img src={MinusIcon}
                        alt='Minus'
                        onClick={()=> handleDecrement('min')}
                        className='Control-Icon'
                       />
                       <span>{minCovers}</span>
                       <img src={isPlusClicked ? PlusActive : PlusIcon}
                       alt='Plus'
                       onClick={()=>handleIncrement('min')}
                       className='Control-Icon'
                       />

                    </div>
                  </div>
                  <div className='Detail-Row'>
                    <label>Max Covers:</label>
                <div className="Control">
                  <img
                    src={MinusIcon}
                    alt="Minus"
                    onClick={() => handleDecrement('max')}
                    className="Control-Icon"
                  />
                  <span>{maxCovers}</span>
                  <img
                    src={isPlusClicked ? PlusActive : PlusIcon}
                    alt="Plus"
                    onClick={() => handleIncrement('max')}
                    className="Control-Icon"
                  />
                </div>
                </div>
                <div className="Detail-Row">
                    <label> Online: </label>
                    <span className='Toggle-Text'>{isOnline ? 'Active' : 'Inactive'}</span>
                       <div className='Toggle-Switch' onClick={toggleOnline} role='switch' aria-checked={isOnline}> 
                        <div className={`Toggle-Button ${isOnline ? 'Active' : ''}`} />
                       
                       </div>
                    </div>
                    <hr/>
                    <div className="Detail-Row">
                    <label>
                        Advanced Settings:</label>
                        <input type='checkbox'/>
                    
                    </div>
                </div>
            </div>
            <div className='Main-area'>
                <div className="Detail-Row-2">
                    {rooms.map(room=>(
                        <button key={room.id}
                        onClick={()=>setActiveRoom(room.id)}
                        className={activeRoom === room.id ? 'active-tab' : '' }
                        > {room.name}</button>
                    ))}
                    <button onClick={handleAddRoom}>+ Add Room</button>
                </div>
                <hr />
                <div className="Grid-Area">
                 <DragDropContext onDragEnd={(result) => onDragEnd(result, activeRoom)}>
                    {rooms.map(
                        room => 
                            activeRoom === room.id && (
                           
                            <Droppable droppableId={`droppable-${activeRoom}`} key={room.id}>
                                {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="Table-Layout">
                                    {rooms
                                    .find((room) => room.id === activeRoom)
                                    .tables.map((table, index) => (
                                        <Draggable key={table.id} draggableId={table.id} index={index}>
                                        {(provided) => (
                                            <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`Table ${table.type}`}
                                            >
                                            {table.name}
                                            </div>
                                        )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                                )}
                            </Droppable>
                            )
                        )}
                            </DragDropContext> 


                        

                </div>
               
            </div>
        </div>
        </div>
     </div>
  )
}

export default FloorPlan;