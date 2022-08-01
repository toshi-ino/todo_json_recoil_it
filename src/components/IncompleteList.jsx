import { useState } from "react";
import { useRecoilState } from 'recoil';

import { recoilModifiedTitle, recoilModifiedDetail, recoilModifiedDue } from './Atom'
import ModifyModal from "./ModifyModal";

const IncompleteList = (props) => {
    const {
        todoItems,
        sortFlag,
        onClickComplete,
        onClickDelete,
        onClickInProgress,
        onClickSort,
        onClickStatusFilter,
        onClickModify
    } = props;

const [recoilModTitle, setRecoilModTitle] = useRecoilState(recoilModifiedTitle)
const [recoilModDetail, setRecoilModDetail] = useRecoilState(recoilModifiedDetail)
const [recoilModDue, setRecoilModDue] = useRecoilState(recoilModifiedDue)

const [open, setOpen] = useState(false);
const [clickIndex, setClickIndex] = useState(0);
const handleOpen = (index) => {
    setRecoilModTitle(todoItems[index].title);
    setRecoilModDetail(todoItems[index].detail);
    setRecoilModDue(todoItems[index].due);
    setClickIndex(index);
    setOpen(true);
};
const handleClose = () => setOpen(false);

const sortIcon = (flag, area) => {
    if (flag === 1 && area === "incompTodos") {
        return "▲";
    } else if (flag === 2 && area === "incompTodos") {
        return "▼";
    } else {
        return "- ";
    }
};

    return (
        <div className="incompleteArea">
            <button
                className="sortButton"
                onClick={() => onClickSort("id", "incompTodos")}
            >
            {sortIcon(sortFlag.id, sortFlag.area)}ID
            </button>
            <button
                className="sortButton"
                onClick={() => onClickSort("due", "incompTodos")}
            >
                {sortIcon(sortFlag.due, sortFlag.area)}期限
            </button>
            <button
                className="filterButton"
                onClick={() => onClickStatusFilter("未着手")}
            >
                未着手
            </button>
            <button
                className="filterButton"
                onClick={() => onClickStatusFilter("着手中")}
            >
                着手中
            </button>
            <h3>未完了のToDo</h3>
            <div class="todoHeader">
                <p>ID</p>
                <p className="todoTitle">タイトル</p>
                <p>ステータス</p>
                <p>詳細</p>
                <p>期限</p>
                <p>完了日</p>
            </div>
            <ul>
                {todoItems.map((incompTodo, index) => {
                    return (
                        <li key={incompTodo.id}>
                            <div className="todoItem">
                                <p>{incompTodo.id}</p>
                                <p className="todoTitle">{incompTodo.title}</p>
                                <p>{incompTodo.status}</p>
                                <p>{incompTodo.detail}</p>
                                <p>{incompTodo.due}</p>
                                <p>{incompTodo.completeAt}</p>
                                <button onClick={() => onClickInProgress(index)}>
                                {incompTodo.status === "未着手" ? "着手" : "戻す"}
                                </button>
                                <button onClick={() => onClickComplete(index)}>完了</button>
                                <button
                                onClick={() => {
                                    handleOpen(index);
                                }}
                                >
                                変更
                                </button>
                                <ModifyModal
                                    open={open}
                                    onClickClose={handleClose}
                                    onClickModify={onClickModify}
                                    clickIndex={clickIndex}
                                />
                                <button onClick={() => onClickDelete(index)}>削除</button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default IncompleteList;
