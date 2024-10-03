/**
 *
 * Manipulating the DOM exercise.
 * This exercise programmatically builds navigation,
 * allows smooth scrolling to anchors from the navigation,
 * and highlights the section in the viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Define Global Variables
 *
 */

const navList = document.getElementById("navbar__list"); // Get the navigation bar element where dynamic links will be appended
let sections = document.querySelectorAll("section"); // Get all sections in the document to create links and track visibility
let header=document.querySelectorAll("header");
/**
 * End Global Variables
 * Start Helper Functions
 *
 */


let isScrolling; // Variable to keep track of the scrolling timeout

/**
 * Hide the header after a certain time if no scrolling occurs
 */
function hideHeaderOnScroll() {
  header.style.top = "0"; // Show the header when scrolling starts
  clearTimeout(isScrolling); // Clear any existing timeout to prevent premature hiding
  isScrolling = setTimeout(() => {
    header.style.top = "-60px"; // After 3 seconds of no scrolling, hide the header
  }, 3000); // Wait for 3 seconds before hiding the header
}

// Check if a section is in the viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <=
      (window.innerHeight || document.documentElement.clientHeight) / 2 &&
    rect.bottom >=
      (window.innerHeight || document.documentElement.clientHeight) / 2
  );
}

// Fade-in effect for section text
function fadeInSectionText(section) {
  const texts = section.querySelectorAll("p"); // Get all paragraphs in the section
  texts.forEach((text) => {
    text.style.opacity = "0"; // Start with 0 opacity
    text.style.transition = "opacity 1s ease-in-out"; // Apply smooth opacity transition
    setTimeout(() => {
      text.style.opacity = "1"; // Fade in after delay
    }, 100); // Start fade-in after 100ms
  });
}

// Slide-in effect for section text
function slideInSectionText(section) {
  const texts = section.querySelectorAll("p"); // Get all paragraphs
  texts.forEach((text) => {
    text.style.transform = "translateX(-100%)"; // Initially off-screen
    text.style.transition = "transform 1s ease-in-out"; // Smooth transform transition
    setTimeout(() => {
      text.style.transform = "translateX(0)"; // Slide into place
    }, 100);
  });
}

// Smoothly scroll to a section when its navigation link is clicked
function smoothScroll(event) {
    event.preventDefault();
    if (event.target.classList.contains('menu__link')) {
        const targetId = event.target.getAttribute('href');  // Get the target section's ID
        const targetSection = document.querySelector(targetId);  // Find the target section
        targetSection.scrollIntoView({ behavior: 'smooth' });  // Smooth scroll
    }
}

// /**
//  * Toggle mobile navigation menu when the icon is clicked
//  */
// function toggleNav() {
//     const nav = document.querySelector('.navbar__menu'); // Get the navbar menu element
//     nav.classList.toggle('responsive');  // Toggle the 'responsive' class to show/hide the menu in mobile view
// }

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

/**
 * Build the navigation dynamically based on the sections in the document
 */
function buildNav() {
  // Clear existing navigation list
  navList.innerHTML = "";
  // Use a document fragment to minimize reflows
  const fragment = document.createDocumentFragment();

  // Loop through each section to create a corresponding navigation link
  sections.forEach((section) => {
    const listItem = document.createElement("li"); // Create a list item for the navbar
    const link = document.createElement("a"); // Create a link for each section

    // Set the text and href using the section's data-nav and ID attributes
    link.textContent = section.getAttribute("data-nav"); // Set the text to section's data-nav attribute
    link.href = `#${section.id}`; // Set the link to point to the section's ID
    link.classList.add("menu__link"); // Add a class for styling

    // Add a click event listener for smooth scrolling and active link highlighting
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default behavior of jumping
      document.querySelector(".menu__link.active")?.classList.remove("active"); // Remove current active class
      link.classList.add("active"); // Add active class to the clicked link
      // Smoothly scroll to the corresponding section
      document.getElementById(section.id).scrollIntoView({ behavior: "smooth" });
    });

    // Append the link to the list item, and list item to the fragment
    listItem.appendChild(link);
    fragment.appendChild(listItem);
  });

  // Append the fragment to the navigation bar
  navList.appendChild(fragment);
  // Event listener for smooth scrolling when a navigation link is clicked
  navList.addEventListener("click", smoothScroll); // Ensure smooth scrolling
}

/**
 * Set the active section and highlight the corresponding navigation link and tab
 */
function setActiveSection() {
  console.log("Checking sections for being in viewport...");
  // Loop through each section to determine if it is in the viewport
  sections.forEach((section) => {
    console.log(`Checking section: ${section.id}`);
    // Get the corresponding navigation item for the section
    const navItem = document.querySelector(`a[href="#${section.id}"]`);

    // Check if the section is in the viewport
    if (isInViewport(section)) {
      console.log(
        `Section ${section.id} is in viewport. Adding active class to section and navigation item.`,
      );
      // Add the active class to the section and navigation item
      section.classList.add("your-active-class");
      navItem.classList.add("active");
      // Trigger the fade-in and slide-in effect for the section's text
      fadeInSectionText(section);
      slideInSectionText(section);
    } else {
      console.log(
        `Section ${section.id} is not in viewport. Removing active class from section and navigation item.`,
      );
      // Remove the active class from the section and navigation item
      section.classList.remove("your-active-class");
      navItem.classList.remove("active");
    }
  });
}

// Create a "scroll to top" button that appears after scrolling
function createScrollToTopButton() {
    const button = document.createElement('button');  // Create button element
    button.textContent = 'Top';  // Set button text
    button.id = 'scroll-to-top';  // Add an ID for styling
    button.style.display = 'none';  // Initially hidden
    document.body.appendChild(button);  // Append button to body

    // Show/hide the button based on scroll position
    window.addEventListener('scroll', () => {
        button.style.display = window.scrollY > 300 ? 'block' : 'none';  // Show if scrolled more than 300px
    });

    // Scroll to top when the button is clicked
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// /**
//  * Make sections collapsible by clicking their headings
//  */
// function makeCollapsible() {
//     sections.forEach(section => {
//         const heading = section.querySelector('h2');
//         const content = section.querySelector('.landing__container');
//
//         heading.addEventListener('click', () => {
//             content.classList.toggle('collapsed');
//             heading.classList.toggle('collapsed');
//         });
//     });
// }

// /**
//  * Show a section based on tab click and hide others
//  */
// function showSection(index) {
//     sections.forEach((section, i) => {
//         const tab = document.querySelector(`.tab:nth-child(${i + 1})`);
//         if (i === index) {
//             section.style.display = 'block';
//             section.scrollIntoView({ behavior: 'smooth' });
//             tab.classList.add('active');
//         } else {
//             section.style.display = 'none';
//             tab.classList.remove('active');
//         }
//     });
// }

/**
 * Add a new section with sliding text effect
 */

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build the navigation menu and tabbed navigation dynamically
document.addEventListener("DOMContentLoaded", buildNav);

// Set the sections as active or inactive based on the viewport position while scrolling
window.addEventListener("scroll", setActiveSection);

// Call the function when the DOM is loaded
document.addEventListener("DOMContentLoaded", createScrollToTopButton);

// Create and initialize the "scroll to top" button functionality
createScrollToTopButton();

// Hide the header when the user is not scrolling
window.addEventListener("scroll", hideHeaderOnScroll);

// // Toggle the mobile navigation menu when the user clicks the menu icon
// document.querySelector('.icon').addEventListener('click', toggleNav);

// // Make the sections collapsible, allowing users to hide/show content by clicking the section headers
// makeCollapsible();

/**
 * Export functions for external use if needed (optional in case of a modular JS system)
 */
// export {
//     isInViewport,
//     hideHeaderOnScroll,
//     toggleNav,
//     buildNav,
//     setActiveSection,
//     smoothScroll,
//     createScrollToTopButton,
//     makeCollapsible,
//     addSlidingTextSection,
//     fadeInSectionText
// };
