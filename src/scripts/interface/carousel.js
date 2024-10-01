import { ui } from "../index.js";
import { btnClickIndication } from "../utilities/helper.js";
import { terminal } from "./terminal.js";

/**
 * Carousel Game Selector
 * 
 * select what game to play by clicking on the left or right 
 * carousel clickedButton to navigate to a desired game. Clicking the
 * left clickedButton will shift the cards right and vice versa. 
 * 
 * NOTE: the slide direction sounds backwards but use the ui to 
 *       understand why it was built like this.
 */
const carousel = (() => {
  // Carousel navigation buttons
  let leftButton = ui.carousel.leftBtn;
  let rightButton = ui.carousel.rightBtn;
  
  // Carousel cards
  let allCards = ui.carousel.cards; 
  let visibleCards = {
    left: allCards[0],
    cur: allCards[1],
    right: allCards[2],

    // Helper functions used in moveCarousel
    updateClasses: function(toggle) {
      this.left.classList[toggle]('left-carousel-position');
      this.cur.classList[toggle]('cur-carousel-position');
      this.right.classList[toggle]('right-carousel-position');
    },
    updateVisibility: function(hideElement, showElement) {
      this[hideElement].classList.add('hidden'); // old card
      this.left = allCards[0];
      this.cur = allCards[1];
      this.right = allCards[2];
      this[showElement].classList.remove('hidden'); // new card
    }
  }

  /**
   * Move Carousel
   * 
   * shuffles 'allCards' in the desired direction then update 
   * what cards should be visible in the ui by toggling necessary 
   * classes.
   * 
   * @param {String} cardDirection - direction the cards move
   * @returns {undefined}
   */
  function moveCarousel(cardDirection) {
    // Ensure old classes are removed
    visibleCards.updateClasses('remove');

    // Perform move 
    if (cardDirection === 'left') {
      // <--- <--- <---
      let moveCard = allCards.shift();
      allCards.push(moveCard);
      visibleCards.updateVisibility('left', 'right'); 
    } else if (cardDirection === 'right') {
      // ---> ---> --->
      let moveCard = allCards.pop();
      allCards.unshift(moveCard);
      visibleCards.updateVisibility('right', 'left'); 
    }
    // Ensure new classes are added
    visibleCards.updateClasses('add');
  }

  /**
   * Toggle Animation
   * 
   * removes animations from all cards to reset animation state 
   * then reapplies new animations based on the passed direction. 
   * 
   * @param {String} cardDirection - direction the cards move
   */
  function toggleAnimation(cardDirection) {
    const animationClasses = [
      'left-animation-to-left', 'left-animation-to-cur', 'left-animation-to-right',
      'right-animation-to-left', 'right-animation-to-cur', 'right-animation-to-right'
    ];

    // Remove previously applied animations
    allCards.forEach(card => {
      animationClasses.forEach(animationClass => {
        card.classList.remove(animationClass);
      });
    });

    // Show animation for new cards
    visibleCards.left.classList.add(`${cardDirection}-animation-to-left`);
    visibleCards.cur.classList.add(`${cardDirection}-animation-to-cur`);
    visibleCards.right.classList.add(`${cardDirection}-animation-to-right`);
  }

  // Carousel navigation button click callback function 
  function handleCarouselClicks() {
    // Determine what buttons was clicked
    let clickedButton = this;
    let direction = this.value;

    // Update carousel
    moveCarousel(direction);
    toggleAnimation(direction);

    btnClickIndication(clickedButton, 'playCarouselClick');

    // Update command displayed
    terminal.typeText(visibleCards.cur.id);
  }

  // Carousel button event listeners
  rightButton.addEventListener('click', handleCarouselClicks);
  leftButton.addEventListener('click', handleCarouselClicks);

})();

export {carousel};