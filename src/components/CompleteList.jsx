const CompleteList = (props) => {
    const {
        todoItems,
        onClickBack,
        onClickSort,
        sortFlag
    } = props;
    const sortIcon = (flag, area) => {
        if (flag === 1 && area === "complete") {
            return "▲";
        } else if (flag === 2 && area === "complete") {
            return "▼";
        } else {
            return "- ";
        }
    };
    return (
        <div className="completeArea">
            <button
                className="sortButton"
                onClick={() => onClickSort("id", "compTodos")}
            >
                {sortIcon(sortFlag.id, sortFlag.area)}ID
            </button>
            <button
                className="sortButton"
                onClick={() => onClickSort("completeAt", "compTodos")}
            >
                {sortIcon(sortFlag.completeAt, sortFlag.area)}完了日
            </button>
            <h3>完了済みのToDo</h3>
            <div class="todoHeader">
                <p>ID</p>
                <p className="todoTitle">タイトル</p>
                <p>ステータス</p>
                <p>詳細</p>
                <p>期限</p>
                <p>完了日</p>
            </div>
            <ul>
                {todoItems.map((compTodo, index) => {  
                    return (
                    <li key={compTodo.id}>
                        <div className="todoItem">
                            <p>{compTodo.id}</p>
                            <p className="todoTitle">{compTodo.title}</p>
                            <p>{compTodo.status}</p>
                            <p>{compTodo.detail}</p>
                            <p>{compTodo.due}</p>
                            <p>{compTodo.completeAt}</p>
                            <button onClick={() => onClickBack(index)}>戻す</button>
                        </div>
                    </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default CompleteList;
