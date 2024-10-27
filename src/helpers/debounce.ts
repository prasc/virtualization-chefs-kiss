
const debounce = (cb: (...arg: any[]) => void, delay: number) => {
    let timer: number | null = null;

    return (...opt: any[]) => {
      if (timer) {
        clearTimeout(timer);
        console.log('Cancelled timer: ', timer)
      }

      timer = setTimeout(() => {
        cb(...opt)
        console.log('Successful timer: ', timer)
        timer = null;
      }, delay) as unknown as number;
    };
    // A function that starts immediately after getting called the first time
    // The second time, it checks if there already is a call in progress, cancels it, then starts again
  };

  export default debounce;