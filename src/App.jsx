import "./App.css";

import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";

import InputToDo from "./components/InputToDo";
import IncompleteList from "./components/IncompleteList";
import CompleteList from "./components/CompleteList";

import { recoilModifiedTitle, recoilModifiedDetail, recoilModifiedDue } from './components/Atom';

import axios from "axios";

const App = () => {
  const [inputToDoTitle, setInputToDoTitle] = useState("");
  const [inputToDoDetail, setInputToDoDetail] = useState("");
  const [inputToDoDue, setInputToDoDue] = useState("");

  const [incompleteToDos, setIncompleteToDos] = useState([]);
  const [completeToDos, setCompleteToDos] = useState([]);

  // 下のFilter用にfullIncompListを持っておく
  const [fullIncompList, setFullIncompList] = useState(incompleteToDos);

  // axiosを使って、APIのやり取りをするオブジェクトを作成 
  const api = axios.create({
    baseURL: "http://localhost:5000/"
  })

  // IncompleteToDosのリストをdb.jsonから取り出す
  // 第２引数にincompleteToDosを渡す必要があるのかは要確認。。
  useEffect(() => {
    const getIncompToDoList = async () => {
      try {
        const allIncompToDoItems = await api.get('/incompTodos')
        setIncompleteToDos(allIncompToDoItems.data);
        setFullIncompList(allIncompToDoItems.data);
      } catch (err) {
        console.log(err);
      }
    }
    getIncompToDoList();
  }, [])

    // IncompleteToDosのリストをdb.jsonから取り出す
    // 第２引数にcompleteToDosを渡す必要があるのかは要確認。。
  useEffect(() => {
    const getCompToDoList = async () => {
      try {
        const allCompToDoItems = await api.get('/compTodos')
        setCompleteToDos(allCompToDoItems.data);
      } catch (err) {
        console.log(err)
      }
    }
    getCompToDoList();
  }, [])

  // const [itemCount, setItemCount] = useState(0)

  const onChangeToDoTitle = (e) => setInputToDoTitle(e.target.value);
  const onChangeToDoDetail = (e) => setInputToDoDetail(e.target.value);
  const onChangeToDoDue = (e) => setInputToDoDue(e.target.value);

  const onClickAdd = () => {
    if (inputToDoTitle === "") return;
    const newListId = () => {
      const totalToDoList = [...incompleteToDos, ...completeToDos];
      if (totalToDoList.length === 0) {
        return 1;
      } else {
        const presentIds = totalToDoList.map((todo) => todo.id);
        return Math.max(...presentIds) + 1;
      }
    };

    // dueとcompleteAtを追加する
    const newToDo = {
      id: newListId(),
      title: inputToDoTitle,
      status: "未着手",
      detail: inputToDoDetail,
      due: inputToDoDue,
      completeAt: ""
    };
    const postNewItemToDB = async () => {
      const postRes = await api.post('/incompTodos', newToDo);
      return postRes.data
    }
    postNewItemToDB()
    const newIncompleteList = [...incompleteToDos, newToDo];
    setIncompleteToDos(newIncompleteList);
    setFullIncompList(newIncompleteList);
    setInputToDoTitle("");
    setInputToDoDetail("");
  };

  const onClickInProgress = async (index) => {
    const workingItem = incompleteToDos[index];
    const workingItemID = workingItem.id
    const incompleteList = [...incompleteToDos];
    const newStatusValue = (workingItem.status === "未着手") ? "着手中" : "未着手";
    // send patch request to server via API
    const updateStatusRes = await api.patch(`/incompTodos/${workingItemID}`, {"status": newStatusValue});
    incompleteList.splice(index, 1, updateStatusRes.data);
    setIncompleteToDos(incompleteList);
    setFullIncompList(incompleteList);
  };

  const onClickDelete = async (index) => {
    const deleteItemID = incompleteToDos[index].id
    const incompleteList = [...incompleteToDos];
    await api.delete(`/incompTodos/${deleteItemID}`);
    incompleteList.splice(index, 1);
    setIncompleteToDos(incompleteList);
    setFullIncompList(incompleteList);
  };

  // 完了をクリックした当日の日付を自動で加える
  const onClickComplete = async (index) => {
    const completeItem = incompleteToDos[index];
    const completeItemID = completeItem.id
    const incompleteList = [...incompleteToDos];

    await api.delete(`/incompTodos/${completeItemID}`)
    incompleteList.splice(index, 1);
    setIncompleteToDos(incompleteList);
    setFullIncompList(incompleteList);

    // completeItemの情報を更新し、completeToDosリストに加える
    completeItem.status = "完了済";
    const formatDate = (date, format) => {
      format = format.replace(/yyyy/g, date.getFullYear());
      format = format.replace(/MM/g, ("0" + (date.getMonth() + 1)).slice(-2));
      format = format.replace(/dd/g, ("0" + date.getDate()).slice(-2));
      return format;
    };
    completeItem.completeAt = formatDate(new Date(), "yyyy-MM-dd");
    await api.post('/compTodos', completeItem)
    const completeList = [...completeToDos, completeItem];
    setCompleteToDos(completeList);
  };

  // Completeアイテムを元に戻す機能、completeAtを空欄に戻す作業を追加
  const onClickBack = async (index) => {
    const putBackItem = completeToDos[index];
    const putBackItemID = putBackItem.id
    const completeList = [...completeToDos];

    await api.delete(`/compTodos/${putBackItemID}`);
    completeList.splice(index, 1);
    setCompleteToDos(completeList);

    // putBackItemの情報を更新し、incompleteToDosリストに加える
    putBackItem.status = "未着手";
    putBackItem.completeAt = "";
    await api.post('/incompTodos', putBackItem);
    const incompleteList = [...incompleteToDos, putBackItem];
    setIncompleteToDos(incompleteList);
    setFullIncompList(incompleteList);
  };

  // modify~系の変数をrecoilを用いてグローバルに変える
  // modifyできるフィールドにdueとcompleteAtを加える
  // useRecoildValueでrecoil atomの値を変数に代入
  const postModifiedTitle = useRecoilValue(recoilModifiedTitle);
  const postModifiedDetail = useRecoilValue(recoilModifiedDetail);
  const postModifiedDue = useRecoilValue(recoilModifiedDue);

  const onClickModify = async (index) => {
    const modifyToDoItem = incompleteToDos[index];
    const modifyToDoItemID = modifyToDoItem.id
    modifyToDoItem.title = postModifiedTitle;
    modifyToDoItem.detail = postModifiedDetail;
    modifyToDoItem.due = postModifiedDue;

    const newIncompleteList = [...incompleteToDos];
    await api.put(`/incompTodos/${modifyToDoItemID}`, modifyToDoItem)
    newIncompleteList.splice(index, 1, modifyToDoItem);
    setIncompleteToDos(newIncompleteList);
    setFullIncompList(newIncompleteList);
  };

  // Sort functions
  // true/falseの２択ではなく、3択（昇順、降順、デフォルト）がいる
  // IDとdue dateの両方でソートができるようにする
  const [incompSortFlag, setIncompSortFlag] = useState({
    id: 0,
    due: 0,
    completeAt: 0
  });
  const [compSortFlag, setCompSortFlag] = useState({
    id: 0,
    due: 0,
    completeAt: 0
  });
  const onClickSortFunc = async (fieldName, listArea) => {
    const sectionFlag = listArea === "incompTodos" ? incompSortFlag : compSortFlag;
    const setSectionFlag = listArea === "incompTodos" ? setIncompSortFlag : setCompSortFlag;
    // sort用の関数を定義
    const sortCompare = (a, b) => {
      if (a[fieldName] > b[fieldName]) {
        return 1 - 2 * sectionFlag[fieldName];
      } else {
        return -1 + 2 * sectionFlag[fieldName];
      }
    };
    // DBから元のリストを取得
    const originalList = await api.get(`/${listArea}`)
    let todoList = listArea === "incompTodos" ? [...incompleteToDos] : [...completeToDos];
    let setTodoList = listArea === "incompTodos" ? setIncompleteToDos : setCompleteToDos

    if (sectionFlag[fieldName] !== 2) {
      todoList.sort(sortCompare);
      setTodoList(todoList);
    } else {
      setTodoList(originalList.data);
    }
    const sortFuncFlag = { id: 0, due: 0, completeAt: 0 };
    sortFuncFlag[fieldName] = (sectionFlag[fieldName] + 1) % 3;
    setSectionFlag(sortFuncFlag);
  };

  // Filter機能（余力があれば）タイトルでの検索を追加
  const [noActionFilterFlag, setNoActionFilterFlag] = useState(false);
  const [inActionFilterFlag, setInActionFilterFlag] = useState(false);
  const onClickStatusFilter = (status) => {
    if (noActionFilterFlag === false && status === "未着手") {
      const statusFilterList = fullIncompList.filter(
        (toDo) => toDo.status === "未着手"
      );
      setIncompleteToDos(statusFilterList);
      setNoActionFilterFlag(true);
      setInActionFilterFlag(false);
    } else if (inActionFilterFlag === false && status === "着手中") {
      const statusFilterList = fullIncompList.filter(
        (toDo) => toDo.status === "着手中"
      );
      setIncompleteToDos(statusFilterList);
      setNoActionFilterFlag(false);
      setInActionFilterFlag(true);
    } else {
      setIncompleteToDos(fullIncompList);
      setNoActionFilterFlag(false);
      setInActionFilterFlag(false);
    }
  };

  return (
    <>
      <header>
        <nav>
          <div>ToDos</div>
          <div>Search box</div>
          <div>Add Button</div>
        </nav>
      </header>
      <main>
        <InputToDo
          inputTitle={inputToDoTitle}
          inputDetail={inputToDoDetail}
          inputDue={inputToDoDue}
          onChangeTitle={onChangeToDoTitle}
          onChangeDetail={onChangeToDoDetail}
          onChangeDue={onChangeToDoDue}
          onClickAdd={onClickAdd}
        />
        <IncompleteList
          todoItems={incompleteToDos}
          sortFlag={incompSortFlag}
          onClickInProgress={onClickInProgress}
          onClickComplete={onClickComplete}
          onClickDelete={onClickDelete}
          onClickSort={onClickSortFunc}
          onClickStatusFilter={onClickStatusFilter}
          // Modify Modal props
          onClickModify={onClickModify}
        />
        <CompleteList
          todoItems={completeToDos}
          sortFlag={compSortFlag}
          onClickBack={onClickBack}
          onClickSort={onClickSortFunc}
        />
      </main>
      <footer>copyright@2022</footer>
    </>
  );
};

export default App;
