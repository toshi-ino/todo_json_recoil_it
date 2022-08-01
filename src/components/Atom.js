import { atom } from 'recoil';

// recoilを使った変更用の変数(atom)を準備
export const recoilModifiedTitle = atom({
    key: 'recoilModifiedTitle',
    default: ""
})

export const recoilModifiedDetail = atom({
    key: 'recoilModifiedDetail',
    default: ""
})

export const recoilModifiedDue = atom({
    key: 'recoilModifiedDue',
    default: ""
})