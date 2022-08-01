import { useRecoilState } from 'recoil';

import { Typography, Modal, Box } from "@mui/material";

import { recoilModifiedTitle, recoilModifiedDetail, recoilModifiedDue } from './Atom'

const modalStyle = {
    position: "absolute",
    top: "25%",
    left: "25%",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    p: "4"
};

const ModifyModal = (props) => {
    const {
        open,
        onClickClose,
        onClickModify,
        clickIndex
    } = props;

    // Recoilを使っての変数を定義
    const [recoilModTitle, setRecoilModTitle] = useRecoilState(recoilModifiedTitle)
    const [recoilModDetail, setRecoilModDetail] = useRecoilState(recoilModifiedDetail)
    const [recoilModDue, setRecoilModDue] = useRecoilState(recoilModifiedDue)
    const onChangeModifiedTitle = (e) => setRecoilModTitle(e.target.value);
    const onChangeModifiedDetail = (e) => setRecoilModDetail(e.target.value);
    const onChangeModifiedDue = (e) => setRecoilModDue(e.target.value);

    return (
        <div id="overlay">
            <Modal
                open={open}
                onClose={onClickClose}
                area-labelledby="modal-modal-title"
                area-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        ToDoの編集
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        タイトル:
                        <input
                            type="text"
                            title="タイトル"
                            placeholder="Please update title..."
                            value={recoilModTitle}
                            onChange={onChangeModifiedTitle}
                        />
                        <br />
                        詳細:
                        <input
                            type="text"
                            placeholder="Please update description..."
                            value={recoilModDetail}
                            onChange={onChangeModifiedDetail}
                        />
                        <input
                            type="date"
                            placeholder="Please update due date..."
                            value={recoilModDue}
                            onChange={onChangeModifiedDue}
                        />
                        <br />
                        <button
                            onClick={() => {
                                onClickModify(clickIndex);
                                onClickClose();
                            }}
                        >
                        変更
                        </button>
                        <button onClick={onClickClose}>キャンセル</button>
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
};

export default ModifyModal;
