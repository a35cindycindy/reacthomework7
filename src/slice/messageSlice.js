
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const messageSlice = createSlice({
  name: 'message',
  initialState: [],
  reducers: {
  
    createMessage(state, action) {
      // 根據 success 的值來決定訊息的類型和內容
      // {
      //   success: true, // 或 false
      //   message: '操作成功' // 或 '操作失敗'
      // }    
      if (action.payload.success) {
        // 成功訊息
        state.push({
          id: action.payload.id,
          type: 'success',
          title: '成功',
          text: action.payload.message,
        });
      } else {
          // 失敗訊息
          state.push({
            id: action.payload.id,
            type: 'danger',
            title: '失敗',
            // 如果 message 是陣列，則將其轉換為以 '、' 分隔的字串
            // 如果 message 不是陣列，則直接使用它
            text: Array.isArray(action?.payload?.message)
              ? action?.payload?.message.join('、')
              : action?.payload?.message,
          });
      }
    },
    // 根據 id 刪除訊息
    // action.payload 是要刪除的訊息的 id
    // state 是當前的訊息列表
    // findIndex 用於找到要刪除的訊息在列表中的索引位置
    // splice 用於從列表中刪除指定索引位置的訊息
    removeMessage(state, action) {
      const index = state.findIndex((item) => item.id === action.payload);
      state.splice(index, 1);
    },
  },
});

export default messageSlice.reducer;

//非同步訊息，讓提示訊息一段時間就消失
export const createAsyncMessage = createAsyncThunk(
  'message/createAsyncMessage',
  // payload 是要創建的訊息的內容
  // dispatch 是用於發送 action 的函數
  // requestId 是這次請求的唯一標識符
  async (payload, { dispatch, requestId }) => {
      dispatch(messageSlice.actions.createMessage({
        ...payload,
        id: requestId,
      }));

    // 設置一個定時器，在 2 秒後自動刪除這條訊息
      setTimeout(() => {
        dispatch(messageSlice.actions.removeMessage(requestId));
      }, 2000);
  },
);

export const { createMessage } = messageSlice.actions;



