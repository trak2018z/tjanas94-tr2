export default function scroll(element: HTMLElement) {
  element.scrollIntoView()
  if(window.scrollY){
    window.scroll(0, window.scrollY - 100);
  }
}
