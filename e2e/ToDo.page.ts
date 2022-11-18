import { Page } from "@playwright/test";

export const ToDoPage = ({ page }: { page: Page }) => {
  const clearCompletedItems = async () => {
    const clearButton = page.locator("button", {
      has: page.getByText("Clear completed"),
    });
    await clearButton.click();
  };

  const createToDo = async (todo: string) => {
    const addInput = page.getByPlaceholder("What needs to be done?");
    await addInput.fill(todo);
    await addInput.press("Enter");
  };

  const getToDoItem = (item: string) => {
    return page.locator("li", { has: page.getByText(item) });
  };

  const getToDoItemsLeft = () => {
    return page.locator("span.todo-count");
  };

  const editToDoItem = async (item: string, newItem: string) => {
    const itemContainer = getToDoItem(item);
    await itemContainer.dblclick();

    const editInput = itemContainer.getByRole("textbox");
    await editInput.fill(newItem);
    await editInput.press("Enter");
  };

  const deleteToDoItem = async (item: string) => {
    const itemContainer = getToDoItem(item);
    await itemContainer.hover();

    const deleteButton = itemContainer.getByRole("button");
    await deleteButton.click();
  };

  const toggleToDoItem = async (item: string) => {
    const itemContainer = getToDoItem(item);
    const todoToggle = itemContainer.getByRole("checkbox");
    await todoToggle.click();
  };

  const filterToDos = async (status: "Active" | "Completed") => {
    const statusLink = page.locator("a", { has: page.getByText(status) });
    await statusLink.click();
  };

  return {
    clearCompletedItems,
    createToDo,
    deleteToDoItem,
    editToDoItem,
    filterToDos,
    getToDoItem,
    getToDoItemsLeft,
    toggleToDoItem,
  };
};
