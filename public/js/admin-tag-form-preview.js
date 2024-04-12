const form = document.getElementById("myForm");
const nameInput = document.getElementById("tagName");
const colorInput = document.getElementById("tagColor");
const imageInput = document.getElementById("tagImage");
const cardDiv = document.getElementById("cardPreview");

// Function to update the tag preview
function updatePreview() {
  const tagName = nameInput.value;
  const tagColor = colorInput.value;
  const tagImage = imageInput.files[0];

  document.getElementById("tagTitlePreview").textContent = tagName;

  // Updating th background color
  document.getElementById("tagPreviewContainer").style.backgroundColor =
    tagColor;

  if (tagImage) {
    const imagePreview = document.getElementById("tagImagePreview");

    // Check if svg
    if (tagImage.type === "image/svg+xml") {
      const svgUrl = URL.createObjectURL(tagImage);

      // Use a <object> tag to display svg element
      const objectElement = document.createElement("object");
      objectElement.data = svgUrl;
      objectElement.type = "image/svg+xml";
      objectElement.width = 100;
      objectElement.height = 100;
      objectElement.classList.add("logo");
      objectElement.id = "tagImagePreview";

      // Replace the <img> tag by the <object> one
      if (imagePreview.parentNode) {
        imagePreview.parentNode.replaceChild(objectElement, imagePreview);
      }
    } else {
      // Otherwise use a <img> tag to display the image
      imagePreview.src = URL.createObjectURL(tagImage);
      imagePreview.alt = "Preview Image";
    }
  }
}

form.addEventListener("input", updatePreview);
