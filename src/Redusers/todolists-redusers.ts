import { v1 } from "uuid";
import { TaskFilterType } from "../App";
import { TodoListType } from "../TodoList";

type tsarType =
  | removeTaskACType
  | addTodoListACType
  | changeTodoListTitleACType
  | changeTodoListFilterACType;

type removeTaskACType = ReturnType<typeof removeTodoListAC>;
type addTodoListACType = ReturnType<typeof addTodoListAC>;
type changeTodoListTitleACType = ReturnType<typeof changeTodoListTitleAC>;
type changeTodoListFilterACType = ReturnType<typeof changeTodoListFilterAC>;
export const todolistsReducer = (
  state: Array<TodoListType>,
  action: tsarType
): Array<TodoListType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST":
      return state.filter((item) => item.id !== action.payload.id);
    case "ADD-TODOLIST":
      return [
        ...state,
        {
          id: v1(),
          title: action.payload.title,
          filter: "all",
        },
      ];

    case "CHANGE-TODOLIST-TITLE":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, title: action.payload.title }
          : item
      );

    case "CHANGE-TODOLIST-FILTER":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, filter: action.payload.filter }
          : item
      );

    default:
      throw new Error("I don't understand this type");
  }
};

export const removeTodoListAC = (todolistId: string) => {
  return {
    type: "REMOVE-TODOLIST",
    payload: { id: todolistId },
  } as const;
};

export const addTodoListAC = (newTodolistTitle: string) => {
  return {
    type: "ADD-TODOLIST",
    payload: { title: newTodolistTitle },
  } as const;
};

export const changeTodoListTitleAC = (
  todolistId2: string,
  newTodolistTitle: string
) => {
  return {
    type: "CHANGE-TODOLIST-TITLE",
    payload: { id: todolistId2, title: newTodolistTitle },
  } as const;
};

export const changeTodoListFilterAC = (
  todolistId2: string,
  newFilter: TaskFilterType
) => {
  return {
    type: "CHANGE-TODOLIST-FILTER",
    payload: {
      id: todolistId2,
      filter: newFilter,
    },
  } as const;
};
