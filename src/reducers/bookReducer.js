const initialState = {
  books: [],
};

const bookReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_BOOKS":
      const newState = {
        ...state,
        books: action.payload,
      };
      return newState;
    default:
      return state;
  }
};


export default bookReducer;
