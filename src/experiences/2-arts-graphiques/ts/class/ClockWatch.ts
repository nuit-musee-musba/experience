export class ClockWatch {
  timerInterval: number | null | NodeJS.Timeout;
  isRunning: boolean;
  totalSeconds: number;
  updateFunc?: (time: number) => void;

  constructor(updateFunc?: (time: number) => void) {
    this.timerInterval = null;
    this.isRunning = false;
    this.totalSeconds = 0;
    this.updateFunc = updateFunc;
  }

  startStopTimer() {
    if (this.isRunning) {
      clearInterval(this.timerInterval!);
      this.isRunning = false;
    } else {
      this.timerInterval = setInterval(this.updateTimer.bind(this), 1000);
      this.isRunning = true;
    }
  }

  resetTimer() {
    clearInterval(this.timerInterval!);
    this.totalSeconds = 0;
    this.isRunning = false;
  }

  updateTimer() {
    this.totalSeconds++;
    if (this.updateFunc) {
      this.updateFunc(this.totalSeconds);
    }
  }
}
