(() => {
  "use strict";

  const STORAGE_KEY = "study-tasks.v1";
  const form = document.getElementById("task-form");
  const nameInput = document.getElementById("task-name");
  const subjectInput = document.getElementById("task-subject");
  const formError = document.getElementById("form-error");
  const list = document.getElementById("task-list");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const storageWarning = document.getElementById("storage-warning");
  let activeFilter = "all";
  let tasks = loadTasks();

  function warnStorage(message) {
    storageWarning.textContent = message;
    storageWarning.hidden = false;
  }

  function isValidTask(task) {
    return task !== null && typeof task === "object"
      && typeof task.id === "string" && task.id.length > 0
      && typeof task.name === "string" && task.name.trim().length > 0
      && task.name.length <= 200
      && typeof task.subject === "string" && task.subject.trim().length > 0
      && task.subject.length <= 80
      && typeof task.completed === "boolean";
  }

  function loadTasks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === null) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) throw new Error("Invalid task list");
      const ids = new Set();
      const validTasks = parsed.filter((task) => {
        if (!isValidTask(task) || ids.has(task.id)) return false;
        ids.add(task.id);
        return true;
      });
      if (validTasks.length !== parsed.length) {
        warnStorage("Một số công việc đã lưu không hợp lệ và không thể hiển thị.");
      }
      return validTasks;
    } catch {
      warnStorage("Không thể đọc dữ liệu đã lưu. Bạn vẫn có thể dùng ứng dụng; hãy kiểm tra quyền lưu trữ của trình duyệt.");
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      storageWarning.hidden = true;
    } catch {
      warnStorage("Chưa lưu được thay đổi. Dữ liệu hiện chỉ còn trong trang này và có thể mất khi tải lại. Hãy kiểm tra dung lượng hoặc quyền lưu trữ của trình duyệt.");
    }
  }

  function createTaskElement(task) {
    const item = document.createElement("li");
    item.className = task.completed ? "task-item is-completed" : "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-toggle";
    checkbox.id = `task-${task.id}`;
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `${task.completed ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}: ${task.name}`);
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      render();
      const replacement = document.getElementById(checkbox.id);
      if (replacement) replacement.focus();
      else document.querySelector(`[data-filter="${activeFilter}"]`).focus();
    });

    const content = document.createElement("div");
    content.className = "task-content";
    const title = document.createElement("label");
    title.className = "task-title";
    title.htmlFor = checkbox.id;
    title.textContent = task.name;
    const subject = document.createElement("span");
    subject.className = "task-subject";
    subject.textContent = task.subject;
    content.append(title, subject);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Xóa";
    deleteButton.setAttribute("aria-label", `Xóa công việc: ${task.name}`);
    deleteButton.addEventListener("click", () => {
      const index = Array.from(list.children).indexOf(item);
      tasks = tasks.filter((entry) => entry.id !== task.id);
      saveTasks();
      render();
      const nextItem = list.children[Math.min(index, list.children.length - 1)];
      if (nextItem) nextItem.querySelector(".delete-button").focus();
      else nameInput.focus();
    });

    item.append(checkbox, content, deleteButton);
    return item;
  }

  function render() {
    const completed = tasks.filter((task) => task.completed).length;
    const pending = tasks.length - completed;
    const visible = tasks.filter((task) => activeFilter === "all"
      || (activeFilter === "completed" ? task.completed : !task.completed));

    list.replaceChildren(...visible.map(createTaskElement));
    document.getElementById("count-all").textContent = tasks.length;
    document.getElementById("count-pending").textContent = pending;
    document.getElementById("count-completed").textContent = completed;
    document.getElementById("total-count").textContent = `${tasks.length} công việc`;
    document.getElementById("progress-count").textContent = `${completed} / ${tasks.length}`;
    document.getElementById("progress-text").textContent = tasks.length === 0
      ? "Bạn chưa có công việc nào."
      : pending === 0 ? "Tuyệt lắm! Bạn đã hoàn thành tất cả công việc."
        : `Còn ${pending} công việc đang chờ bạn hoàn thành.`;
    const progress = document.getElementById("task-progress");
    progress.max = tasks.length || 1;
    progress.value = completed;
    progress.textContent = `${tasks.length ? Math.round(completed / tasks.length * 100) : 0}%`;

    filterButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === activeFilter));
    });

    document.getElementById("empty-state").hidden = visible.length > 0;
    document.getElementById("empty-title").textContent = tasks.length === 0
      ? "Bắt đầu từ một việc nhỏ"
      : activeFilter === "completed" ? "Chưa có công việc đã hoàn thành" : "Bạn đã hoàn thành tất cả!";
    document.getElementById("empty-description").textContent = tasks.length === 0
      ? "Thêm công việc đầu tiên để lên kế hoạch học tập của bạn."
      : activeFilter === "completed" ? "Đánh dấu một công việc khi bạn học xong nhé."
        : "Thêm việc mới hoặc xem lại các công việc đã hoàn thành.";
    document.getElementById("result-summary").textContent = `Đang hiển thị ${visible.length} công việc. Tổng cộng ${pending} chưa hoàn thành, ${completed} đã hoàn thành.`;
  }

  function clearFormError() {
    formError.hidden = true;
    nameInput.removeAttribute("aria-invalid");
    subjectInput.removeAttribute("aria-invalid");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFormError();
    const name = nameInput.value.trim();
    const subject = subjectInput.value.trim();
    const invalidInput = !name || name.length > 200 ? nameInput
      : !subject || subject.length > 80 ? subjectInput : null;
    if (invalidInput) {
      formError.textContent = invalidInput === nameInput
        ? "Vui lòng nhập tên công việc từ 1 đến 200 ký tự, không chỉ gồm khoảng trắng."
        : "Vui lòng nhập môn học từ 1 đến 80 ký tự, không chỉ gồm khoảng trắng.";
      formError.hidden = false;
      invalidInput.setAttribute("aria-invalid", "true");
      invalidInput.focus();
      return;
    }

    const id = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    tasks.unshift({ id, name, subject, completed: false });
    // A newly added task should be visible even when the completed filter was active.
    activeFilter = "all";
    saveTasks();
    form.reset();
    render();
    nameInput.focus();
  });

  nameInput.addEventListener("input", clearFormError);
  subjectInput.addEventListener("input", clearFormError);
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      render();
    });
  });

  render();
})();
