const popOver1 = document.querySelector("#popover_1");
const popOverOption1 = "#popover_option";
function getCSRFTokenFromHTML() {
  return document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");
}

console.log("test");

const addTaskToolTip = `
    <div
      class="p-4 bg-transparent rounded  flex flex-col gap-2"
    >
      <div class="flex flex-col text-xl text-white">
        <label for="addTaskInput" class="text-center"><i class="fa-solid fa-list-check"></i> Task</label>
        <input
          type="text"
          id="addTaskInput"
          class="border-white rounded-xl focus:border-[2px] h-[30px] focus:outline-none focus:border-sky-200 bg-transparent"
        />
      </div>
      <div class="flex flex-col text-xl text-white">
        <label for="addMinuteInput" class="text-center"><i class="fa-solid fa-clock"></i> Minutes</label>
        <input
          type="text"
          id="addMinuteInput"
          class="border-white rounded-xl focus:border-[2px] h-[30px] focus:outline-none focus:border-sky-200 bg-transparent"
        />
      </div>
      <div class="flex text-white justify-center gap-4 mt-2">
        <button
          onclick="addTaskFunction()"
          class="px-4 bg-green-500 rounded font-bold transition-all duration-300 focus:scale-90"
        >
          Add
        </button>

      </div>
    </div>
`;

const addCategoryToolTip = `
    <div
      class="p-4 bg-transparent rounded  flex flex-col gap-2"
    >
      <div class="flex flex-col text-xl text-white">
        <label for="addCategoryInput" class="text-center"><i class="fa-solid fa-list-check"></i> Category</label>
        <input
          type="text"
          id="addCategoryInput"
          class="border-white rounded-xl focus:border-[2px] h-[30px] focus:outline-none focus:border-sky-200 bg-transparent"
        />
      </div>

      <div class="flex text-white justify-center gap-4 mt-2">
        <button
          onclick="addCategoryFunction()"
          class="px-4 bg-green-500 rounded font-bold transition-all duration-300 focus:scale-90"
        >
          Add
        </button>

      </div>
    </div>

`;

const endpoint = "http://127.0.0.1:8000/listdo/api";
const username = user_details["username"];
const password = user_details["password"];
const friendModal = document.querySelector("#friendRequest");

tippy("#addCategory", {
  content: addCategoryToolTip,
  allowHTML: true,
  trigger: "click",
  placement: "top",
  interactive: true,
});

tippy("#addTask", {
  content: addTaskToolTip,
  allowHTML: true,
  trigger: "click",
  placement: "top",
  interactive: true,
});

$(popOverOption1).hide();

popOver1.addEventListener("click", () => {
  $(popOverOption1).slideToggle();
});

function accessToken(username, password) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${endpoint}/token/`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        username: username,
        password: password,
      }),
      success: function (response) {
        resolve(response.access);
      },
      error: function (error) {
        reject("Error fetching token", error);
      },
    });
  });
}

function checkCategories(id_name, category) {
  const addCategory = `
  <li

    id="${id_name}"
    class="select_category text-[15pt] w-full text-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:bg-white hover:text-black hover:rounded-full hover:shadow-xl hover:shadow-black cursor-pointer"
  >
    ${category}
  </li>
  
  `;
  const categories_list = document.querySelectorAll("#listCategory > li");
  if (categories_list.length == 0) {
    $("#listCategory").append(addCategory);

    $(`#${id_name}`).hide(0, () => {
      $(`#${id_name}`).show(0, () => {
        anime({
          targets: `#${id_name}`,
          scale: [0, 1.5],
          easing: "easeOutQuad",
          duration: 2000,
        });
      });
    });
  } else {
    $(`#${categories_list[categories_list.length - 1].id}`).after(addCategory);
    $(`#${id_name}`).hide(0, () => {
      $(`#${id_name}`).show(1000, () => {
        // anime({
        //   targets: `#${id_name}`,
        //   scale: [0, 1.5],
        //   easing: "easeOutQuad",
        //   duration: 2000,
        // });
      });
    });
  }

  categoryType = id_name;
  document.querySelector("#selectedCategoryName").innerText = category;
}

function createCategory(token, category_name) {
  $.ajax({
    url: `${endpoint}/createCategory/`,
    type: "POST",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-CSRFToken": getCSRFTokenFromHTML(),
    },
    data: JSON.stringify({
      category_name: category_name,
    }),
    success: function (response) {
      const category_id = response.category.id;
      const category_name = response.category.category_name;

      checkCategories(category_id, category_name);
      categoryType = "";
      console.log(categoryType);
      console.log("test 222 ");
      getTask(category_id, token);
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function addCategoryFunction() {
  const categoryValue = document.querySelector("#addCategoryInput").value;
  async function create() {
    try {
      let tokenAccess = await accessToken(username, password);

      createCategory(tokenAccess, categoryValue);
    } catch (error) {
      console.error(error);
    }
  }
  create();
}

document.querySelector("#listCategory").addEventListener("click", (e) => {
  document.querySelector("#selectedCategoryName").innerText =
    e.target.innerText;
  getSpecificTask(e.target.id);
});

function createTask(token, currentPK, task_name, time) {
  $.ajax({
    url: `${endpoint}/createTask/`,
    type: "POST",
    contentType: "application/JSON",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-CSRFToken": getCSRFTokenFromHTML(),
    },
    data: JSON.stringify({
      user: Number(user_pk),
      category: Number(currentPK),
      task_name: task_name,
      time: time,
    }),
    success: (response) => {
      console.log(response);

      const task_name = response.task_name;
      const task_id = response.id;
      const task_time = response.time;

      let htmlRender = `
                <div
                  id="${task_id}"
                  class="task bg-black w-full border-2 border-white p-4 rounded-[12px] shadow-xl shadow-black flex"
                >
                  <div class="w-[70%] p-2 flex gap-2">
                    <button
                      data-id = "${task_id}"
                      class="px-4 bg-sky-300 font-bold text-white rounded shadow shadow-slate-400 h-[50px] max-h-[50%] self-center editBtn"
                    >
                      Edit
                    </button>
                    <h1 class="text-xl font-bold self-center">
                      <span id="taskName">${task_name}</span> -
                      <span id="taskTime">${task_time} minutes</span>
                     </h1>
                  </div>
                  <div class="w-[30%] flex justify-end gap-2">
                    <button>
                      <i
                        class="fa-solid fa-check px-4 py-2 rounded bg-green-400 shadow shadow-slate-400"
                      ></i>
                    </button>
                    <button data-idKey=${task_id}>
                      <i
                        data-idKey=${task_id}
                        class="fa-solid fa-x px-4 py-2 rounded bg-red-400 shadow shadow-slate-400 removeTask"
                      ></i>
                    </button>
                  </div>
                </div>
      `;

      if (taskCount === 0) {
        $("#warningMessage").hide(1000, () => {
          $("#warningMessage").remove();
          document
            .querySelector("#listTask")
            .classList.remove("justify-center");
          setTimeout(() => {
            $("#listTask").append(htmlRender);
          }, 1000);
        });
      } else {
        const all_task = document.querySelectorAll(".task");
        const_last_id = all_task[all_task.length - 1].id;
        $(`#${const_last_id}`).after(htmlRender);
      }
      taskCount += 1;
    },
    error: (err) => {
      console.log(err);
    },
  });
}

function addTaskFunction() {
  const task_name = document.querySelector("#addTaskInput").value;
  const minute = document.querySelector("#addMinuteInput").value;

  async function taskCreation() {
    try {
      let tokenAccess = await accessToken(username, password);
      createTask(tokenAccess, categoryType, task_name, minute);
    } catch (error) {
      console.error(error);
    }
  }
  taskCreation();
}

function getTask(id, token) {
  $.ajax({
    url: `${endpoint}/getTask/`,
    type: "GET",
    data: {
      id: id,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "X-CSRFToken": getCSRFTokenFromHTML(),
    },
    success: function (response) {
      let time = 500;
      const data = response;

      const all_task = document.querySelectorAll(".task");
      console.log("Selected Now");
      if (categoryType == id) {
        console.log("Already Selected");
      } else if (response.length == 0) {
        document.querySelector("#listTask").classList.remove("justify-center");
        $("#warningMessage").remove();
        all_task.forEach((task) => {
          $(`#${task.id}`).hide(1000, () => {
            $(`#${task.id}`).remove();
            document.querySelector("#listTask").classList.add("justify-center");
          });
        });

        setTimeout(() => {
          const warningMessage = `
          <div class = "text-center h-full flex items-center justify-center" id = "warningMessage"> No Data Found </div>
        `;

          $("#listTask").append(warningMessage);
        }, 1500);
      } else if (response.length != 0 && id != categoryType) {
        all_task.forEach((task) => {
          $(`#${task.id}`).hide(1000, () => {
            $(`#${task.id}`).remove();
          });
        });

        setTimeout(() => {
          $("#warningMessage").hide(500, () => {
            document
              .querySelector("#listTask")
              .classList.remove("justify-center");
            $("#warningMessage").remove();
            $("#listTask").html();
          });

          data.forEach((task) => {
            const change_task = `
              <div
                id="${task.id}"
                class="task bg-black w-full border-2 border-white p-4 rounded-[12px] shadow-xl shadow-black flex"
              >
                <div class="w-[70%] p-2 flex gap-2">
                  <button
                   data-id = "${task.id}"
                    class="px-4 bg-sky-300 font-bold text-white rounded shadow shadow-slate-400 h-[50px] max-h-[50%] self-center editBtn"
                  >
                    Edit
                  </button>
                  <h1 class="text-xl font-bold self-center">
                    <span id="taskName">${task.task_name}</span> -
                    <span id="taskTime">${task.time} minutes</span>
                  </h1>
                </div>
                <div class="w-[30%] flex justify-end gap-2">
                  <button>
                    <i
                      class="fa-solid fa-check px-4 py-2 rounded bg-green-400 shadow shadow-slate-400"
                    ></i>
                  </button>
                  <button data-idKey=${task.id}>
                    <i data-idKey=${task.id}
                      class="fa-solid fa-x px-4 py-2 rounded bg-red-400 shadow shadow-slate-400 removeTask"
                    ></i>
                  </button>
                </div>
              </div>
            `;
            $("#listTask").append(change_task);
            $(`#${task.id}`).hide();
            setTimeout(() => {
              $(`#${task.id}`).show(100);
            }, time);

            time += 100;
          });
        }, 500);
      }
      taskCount = response.length;
      categoryType = id;
    },
    error: function (error) {
      console.error(error);
    },
  });
}

function getSpecificTask(id) {
  async function taskRetrieval() {
    try {
      const tokenAccess = await accessToken(username, password);
      getTask(id, tokenAccess);
    } catch (err) {
      console.error(err);
    }
  }
  taskRetrieval();
}

function removeTask(token, id) {
  $.ajax({
    url: `${endpoint}/deleteTask/`,
    type: "DELETE",
    data: {
      id: id,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "X-CSRFToken": getCSRFTokenFromHTML(),
    },
    success: (response) => {
      taskCount -= 1;

      if (taskCount === 0) {
        const warningMessage = `
          <div class = "text-center h-full flex items-center justify-center" id = "warningMessage"> No Data Found </div>
      `;
        $("#listTask").html("");
        $("#listTask").append(warningMessage);
      } else {
        document.querySelector("#listTask").classList.remove("justify-center");
      }
      console.log(response);
    },
    catch(error) {
      console.error(error);
    },
  });
}

async function setRemoveTask(id) {
  try {
    let tokenAccess = await accessToken(username, password);
    removeTask(tokenAccess, id);
  } catch (error) {
    console.error(error);
  }
}

function UpdateTask(token, id, name, minutes) {
  $.ajax({
    url: `${endpoint}/updateTask/${id}`,
    type: "PUT",
    contentType: "application/JSON",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-CSRFToken": getCSRFTokenFromHTML(),
    },
    data: JSON.stringify({
      task_name: name,
      time: minutes,
    }),
    success: (response) => {
      const id_to_update = response.id;
      const task_name = response.task_name;
      const time = response.time;

      document.querySelector("#taskName").innerHTML = task_name;
      document.querySelector("#taskTime").innerHTML = time + " minutes";

      document.querySelector("#name").value = "";
      document.querySelector("#minutes").value = "";
      editModal.close();
    },
    error: (err) => {
      console.error(err);
    },
  });
}

async function handleUpdateTask(id, name, minutes) {
  try {
    let token = await accessToken(username, password);
    UpdateTask(token, id, name, minutes);
  } catch (err) {
    console.error(err);
  }
}

function addFriend(following_id, token) {
  $.ajax({
    url: `${endpoint}/addFriend/?user_id=${following_id}`,
    type: "POST",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-CSRFToken": getCSRFTokenFromHTML(),
    },
    data: JSON.stringify({
      user_id: following_id,
    }),
    success: (response) => {
      console.log(response);
    },
    error: (err) => {
      console.error(err);
    },
  });
}

function removeFriend(following_id, token) {
  $.ajax({
    url: `${endpoint}/unfriend/?user_id=${following_id}`,
    type: "DELETE",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-CSRFToken": getCSRFTokenFromHTML(),
    },
    data: JSON.stringify({
      user_id: following_id,
    }),
    success: (response) => {
      console.log(response);
    },
    error: (err) => {
      console.error(err);
    },
  });
}

async function addFriendFunction(following_id) {
  let token = await accessToken(username, password);

  try {
    addFriend(following_id, token);
  } catch (err) {
    console.error(err);
  }
}
async function removeFriendFunction(following_id) {
  let token = await accessToken(username, password);

  try {
    removeFriend(following_id, token);
  } catch (err) {
    console.error(err);
  }
}

document.querySelector("#listTask").addEventListener("click", (e) => {
  if (e.target.classList.contains("removeTask")) {
    let id_key = e.target.dataset.idkey;
    console.log(id_key);
    $(`#${id_key}`).hide(1000, () => {
      $(`${id_key}`).remove();
      setRemoveTask(id_key);
    });
  } else if (e.target.classList.contains("editBtn")) {
    const id = e.target.dataset.id;
    const editModal = document.querySelector("#editModal");
    editModal.showModal();

    document.querySelector("#acceptUpdate").addEventListener("click", () => {
      let nameUpdate = document.querySelector("#name").value;
      let minutesUpdate = document.querySelector("#minutes").value;
      handleUpdateTask(id, nameUpdate, minutesUpdate);
    });

    document.querySelector("#exitUpdate").addEventListener("click", () => {
      editModal.close();
      nameUpdate = document.querySelector("#name").value = "";
      minutesUpdate = document.querySelector("#minutes").value = "";
    });
  }
});

document.querySelector("#suggestFriends").addEventListener("click", (e) => {
  const button = e.target.closest("button");

  if (button) {
    const isClicked = button.getAttribute("data-is-clicked");
    const user_id = button.getAttribute("data-user-id");

    if (isClicked === "0") {
      addFriendFunction(user_id);
      button.setAttribute("data-is-clicked", "1");
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-dash transition-all duration-300 hover:text-red-400" viewBox="0 0 16 16">
            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1m0-7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
            <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
        </svg>
      `;
    } else if (isClicked === "1") {
      removeFriendFunction(user_id);
      button.setAttribute("data-is-clicked", "0");
      button.innerHTML = `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          class="bi bi-person-fill-add transition-all duration-300 hover:text-green-400"
          viewBox="0 0 16 16"
        >
          <path
            d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
          />
          <path
            d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"
          />
        </svg>
    `;
    }
  }
});

document.querySelector("#friendRequestBtn").addEventListener("click", () => {
  $(popOverOption1).slideUp();
  friendModal.showModal();
});

document.querySelector("#closeFriend").addEventListener("click", () => {
  document.querySelector("#friendRequest").close();
});
