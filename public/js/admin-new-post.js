textarea = document.querySelector("#postTitleInput");
textarea.addEventListener("input", autoResize, false);

function autoResize() {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
}

const textPreviewArea = document.querySelector("#postTextPreviewInput");
textPreviewArea.addEventListener("input", autoResize, false);

const imageContainer = document.getElementById("postImagePreview");
const dropArea = document.getElementById("dropArea");
const postImageInput = document.getElementById("postImageInput");
const displayImage = document.getElementById("img-view");
var hasImage = false;

dropArea.addEventListener("click", () => {
  postImageInput.click();
});

imageContainer.addEventListener("click", () => {
  postImageInput.click();
});

displayImage &&
  displayImage.addEventListener("mouseenter", () => {
    if (hasImage) return;
    displayImage.style.backgroundColor = "#f7f8ff";
  });

displayImage &&
  displayImage.addEventListener("mouseleave", () => {
    displayImage.style.backgroundColor = "transparent";
  });

// Special method to set the background image in full width
const uploadImage = () => {
  let imageLink = URL.createObjectURL(postImageInput.files[0]);
  hasImage = true;
  imageContainer.src = imageLink;
  imageContainer.alt = "Image";
  if (displayImage) {
    displayImage.remove();

    displayImage.textContent = "";
    displayImage.style.backgroundColor = "transparent";
    displayImage.style.border = 0;
  }
};

postImageInput.addEventListener("change", () => {
  uploadImage();
});

// Use to drag & drop images
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
});

// Use to drag & drop images
dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  postImageInput.files = e.dataTransfer.files;
  uploadImage();
});

const select = document.getElementById("tagSelect");
const selectedTag = document.getElementById("selectedTag");
const tagName = document.getElementById("tagName");
const tagImage = document.getElementById("tagImage");

select.addEventListener("change", (e) => {
  const selectedOption = JSON.parse(select.options[select.selectedIndex].value);

  selectedTag.style.backgroundColor = selectedOption.TagColor;
  tagName.textContent = selectedOption.TagName;
  tagImage.src = selectedOption.TagImage;
});

const hiddenPostContent = document.getElementById("hiddenPostContent");

const toolbarOptions = [
  [{ header: [1, 2, false] }],
  ["bold", "italic", "underline", "strike"], // toggled buttons
  [{ align: [] }],
  ["blockquote"],
  ["link", "image"],

  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent


  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  ["clean"], // remove formatting button
];

const quill = new Quill("#postContent", {
  theme: "snow",
  modules: {
    toolbar: toolbarOptions,
  },
});

quill.on("text-change", (delta, oldDelta, source) => {
  hiddenPostContent.value = quill.getSemanticHTML();
});
