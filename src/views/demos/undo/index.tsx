import React, { useState } from 'react';

import { addRecord, getRollbackStack, getUndoStack, rollbackRecord, undoRecord } from './Record';
import "./index.less";

const getUndoStackNameList = () => getUndoStack().map((command) => command.name);
const getRollbackStackNameList = () => getRollbackStack().map((command) => command.name);

function Undo() {
  const [undoStackNameList, setUndoStackNameList] = useState<string[]>([]);
  const [rollbackStackNameList, setRollbackStackNameList] = useState<string[]>([]);

  const onClickCircle = (name: string) => {
    addRecord({name});
    setUndoStackNameList(getUndoStackNameList());
  }

  const onUndo = () => {
    undoRecord();
    setRollbackStackNameList(getRollbackStackNameList());
    setUndoStackNameList(getUndoStackNameList());
  }

  const onBack = () => {
    rollbackRecord();
    setRollbackStackNameList(getRollbackStackNameList());
    setUndoStackNameList(getUndoStackNameList());
  }

  return (
    <div id="app">
        <div>
            点击添加：
            <div className="circleBox">
                <div className="red circle" onClick={() => onClickCircle("red")}></div>
                <div className="green circle" onClick={() => onClickCircle("green")}></div>
                <div className="blue circle" onClick={() => onClickCircle("blue")}></div>
            </div>
        </div>

        <div>
            <button onClick={onUndo}>撤销</button>
            <button onClick={onBack}>回退</button>
        </div>
        <div>
            <div>
                <p> 当前的视图</p>
                <div className="circle"></div>
            </div>
            <div className="listBox">
                <div>
                    <p>可撤销列表</p>
                    <div className="undoList">
                        {
                          undoStackNameList.map((val, index) => {
                            return <div key={`undo-list-${index}`} className={`circle ${val}`}></div>
                          })
                        }
                    </div>
                </div>

                <div>
                    <p>可回退列表</p>
                    <div className="rollbackList">
                        {
                          rollbackStackNameList.map((val, index) => {
                            return <div key={`rollback-list-${index}`} className={`circle ${val}`}></div>
                          })
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Undo;