const InputToDo = (props) => {
    const {
        inputTitle,
        inputDetail,
        inputDue,
        onChangeTitle,
        onChangeDetail,
        onChangeDue,
        onClickAdd
    } = props;
    return (
        <>
            <div className="inputArea">
            <input
                type="text"
                placeholder="Input ToDo title.."
                value={inputTitle}
                onChange={onChangeTitle}
            />
            <input
                type="text"
                placeholder="Input ToDo details (optional).."
                value={inputDetail}
                onChange={onChangeDetail}
            />
            <input
                type="date"
                placeholder="today"
                value={inputDue}
                onChange={onChangeDue}
            />
            <button onClick={onClickAdd}>追加</button>
            </div>
        </>
    );
};

export default InputToDo;
