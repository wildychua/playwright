import { test, expect } from "@playwright/test";
import { ToDoPage } from "./ToDo.page";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/#/");
});

test.describe("Add Todos", () => {
  const TODO_ITEM = "Eat lunch";

  test("should be able to add todo items", async ({ page }) => {
    const todoPage = ToDoPage({ page });
    await todoPage.createToDo(TODO_ITEM);

    const todoItem = todoPage.getToDoItem(TODO_ITEM);
    await expect(todoItem).toHaveCount(1);

    const itemsLeft = todoPage.getToDoItemsLeft();
    await expect(itemsLeft).toHaveText("1 item left");
  });
});

test.describe("Edit Todos", () => {
  const TODO_ITEM = "Eat lunch";

  test.beforeEach(async ({ page }) => {
    const todoPage = ToDoPage({ page });
    await todoPage.createToDo(TODO_ITEM);
  });

  test("should be able to delete item", async ({ page }) => {
    const todoPage = ToDoPage({ page });
    await todoPage.deleteToDoItem(TODO_ITEM);

    const todoItems = todoPage.getToDoItem(TODO_ITEM);
    const todoItemCount = todoPage.getToDoItemsLeft();

    await expect(todoItems).toHaveCount(0);
    await expect(todoItemCount).toHaveCount(0);
  });

  test("should be able to edit item", async ({ page }) => {
    const NEW_ITEM = "Eat dinner";

    const todoPage = ToDoPage({ page });
    await todoPage.editToDoItem(TODO_ITEM, NEW_ITEM);

    const item = todoPage.getToDoItem(NEW_ITEM);
    await expect(item).toHaveText(NEW_ITEM);
  });

  test("should be able to toggle item", async ({ page }) => {
    const todoPage = ToDoPage({ page });
    await todoPage.toggleToDoItem(TODO_ITEM);

    const item = todoPage.getToDoItem(TODO_ITEM);

    await expect(item).toHaveClass("completed");
    await expect(item.getByText(TODO_ITEM)).toHaveCSS(
      "text-decoration",
      /line-through/
    );
    await expect(item.getByRole("checkbox")).toBeChecked();
  });
});

test.describe("Filter Todos", () => {
  const ACTIVE_ITEM = "Eat lunch";
  const COMPLETED_ITEM = "Eat breakfast";

  test.beforeEach(async ({ page }) => {
    const todoPage = ToDoPage({ page });
    await todoPage.createToDo(ACTIVE_ITEM);
    await todoPage.createToDo(COMPLETED_ITEM);
    await todoPage.toggleToDoItem(COMPLETED_ITEM);
  });

  test("should be able to filter active items", async ({ page }) => {
    const todoPage = ToDoPage({ page });
    await todoPage.filterToDos("Active");

    await expect(todoPage.getToDoItem(ACTIVE_ITEM)).toHaveCount(1);
    await expect(todoPage.getToDoItem(COMPLETED_ITEM)).toHaveCount(0);
  });

  test("should be able to clear completed items", async ({ page }) => {
    const todoPage = ToDoPage({ page });
    await todoPage.clearCompletedItems();

    await expect(todoPage.getToDoItem(ACTIVE_ITEM)).toHaveCount(1);
    await expect(todoPage.getToDoItem(COMPLETED_ITEM)).toHaveCount(0);
  });
});
