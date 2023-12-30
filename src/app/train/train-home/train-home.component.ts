import { Component, HostListener } from '@angular/core';
import { lastValueFrom, timer } from 'rxjs';
import { ThemeService } from 'src/app/physics/theme.service';

@Component({
  selector: 'app-train-home',
  templateUrl: './train-home.component.html',
  styleUrls: ['./train-home.component.scss']
})
export class TrainHomeComponent {

  constructor (
    public themeService: ThemeService
  ) {}

  theme: 0 | 1 = 0 // 0 = light, 1 = dark
  pi = 3.141592653589
  window_width: any;
  window_height: any;
  track_width: any;
  track_height: any;
  track_straight: any;
  track_curve: any;
  waypoints: any;
  car_styles: any = {};
  car_width: any;
  car_height: any;
  cars: any = [];
  ticks = 4040
  currentTick = 0
  displacement_table: any = []
  interacted = false;
  // track length = 1834 waypoints

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.window_width = document.getElementsByClassName("train-content-container")[0].scrollWidth;
    this.window_height = document.getElementsByClassName("train-content-container")[0].scrollHeight;
    this.track_width = this.window_width * 0.5
    this.track_height = this.window_height * 0.9
    this.track_straight = this.track_height - this.track_width
    this.track_curve = this.track_width/2 * this.pi
    this.car_width = this.window_width * 0.0666
    this.car_height = this.window_height * 0.1
  }
  
  async ngOnInit() {
    this.onResize()
    this.init_cars()
    this.init_waypoints()
    this.init_displacement_table()
    this.restartAnimation()
  }

  init_waypoints() {
    this.waypoints = []
    let straight_waypoints = 500
    let curve_waypoints = straight_waypoints * this.track_curve / this.track_straight
    for (let i=0; i<straight_waypoints; i++) {
      this.waypoints.push([
        this.window_width*0.25 - this.car_width/2, 
        this.window_height*0.05 + this.track_width/2 + i*this.track_straight/(straight_waypoints-1) - this.car_height/2,
        0
      ])
    }
    for (let i=0; i<curve_waypoints; i++) {
      this.waypoints.push([
        this.window_width*0.5 - Math.cos(this.pi*i/curve_waypoints)*this.track_width/2 - this.car_width/2, 
        this.window_height*0.95 - this.track_width/2 + Math.sin(this.pi*i/curve_waypoints)*this.track_width/2 - this.car_height/2,
        -this.pi*i/curve_waypoints
      ])
    }
    for (let i=0; i<straight_waypoints; i++) {
      this.waypoints.push([
        this.window_width*0.75 - this.car_width/2, 
        this.window_height*0.95 - this.track_width/2 - i*this.track_straight/(straight_waypoints-1) - this.car_height/2,
        0
      ])
    }
    for (let i=0; i<curve_waypoints; i++) {
      this.waypoints.push([
        this.window_width*0.5 + Math.cos(this.pi*i/curve_waypoints)*this.track_width/2 - this.car_width/2, 
        this.window_height*0.05 + this.track_width/2 - Math.sin(this.pi*i/curve_waypoints)*this.track_width/2 - this.car_height/2,
        -this.pi*i/curve_waypoints
      ])
    }
  }

  init_cars() {
    this.cars = [
      {
        id: `car-0`,
        speed: 1, // waypoint per tick
        displacement: 475,
        acceleration: 0
      },
      {
        id: `car-1`,
        speed: 1,
        displacement: 380,
        acceleration: 0
      },
      {
        id: `car-2`,
        speed: 1,
        displacement: 285,
        acceleration: 0
      },
      {
        id: `car-3`,
        speed: 1,
        displacement: 190,
        acceleration: 0
      },
      {
        id: `car-4`,
        speed: 1,
        displacement: 95,
        acceleration: -0.0025
      },
      {
        id: `car-5`,
        speed: 1,
        displacement: 0,
        acceleration: -0.0025
      },
    ]
  }

  init_displacement_table() {
    let count = 0
    this.displacement_table = []
    let temp1: any = {}
    for (let car of this.cars) {
      temp1[car.id] = this.waypoints[Math.round(car.displacement)]
      car.displacement += car.speed
      car.speed += car.acceleration
    }
    this.displacement_table.push(temp1)
    while (count <= this.ticks) {
      let temp2: any = {}
      for (let car of this.cars) {
        if (car.displacement >= this.waypoints.length) {
          car.displacement -= this.waypoints.length
        }
        temp2[car.id] = this.waypoints[Math.round(car.displacement)]
        car.displacement += car.speed
        car.speed += car.acceleration
      }
      this.displacement_table.push(temp2)
      count += 1
      // 5, 6 stop //
      if (count == 400) {
        this.cars[4].speed = 0
        this.cars[4].acceleration = 0
        this.cars[5].speed = 0
        this.cars[5].acceleration = 0
      }
      // 4 stop //
      if (count == 724) {
        this.cars[3].acceleration = -0.002
      }
      if (count == 724+500) {
        this.cars[3].speed = 0
        this.cars[3].acceleration = 0
      }
      // 5, 6 go //
      if (count == 1264) {
        this.cars[4].acceleration = 0.0025
        this.cars[5].acceleration = 0.0025
      }
      if (count == 1264+400) {
        this.cars[4].speed = 1
        this.cars[4].acceleration = 0
        this.cars[5].speed = 1
        this.cars[5].acceleration = 0
      }
      // 2, 3 stop //
      if (count == 1554) {
        this.cars[1].acceleration = -0.0025
        this.cars[2].acceleration = -0.0025
      }
      if (count == 1554+400) {
        this.cars[1].speed = 0
        this.cars[1].acceleration = 0
        this.cars[2].speed = 0
        this.cars[2].acceleration = 0
      }
      // 4 go //
      if (count == 1990) {
        this.cars[3].acceleration = 0.002
      }
      if (count == 1990+500) {
        this.cars[3].acceleration = 0
        this.cars[3].speed = 1
      }
      // 1 stop //
      if (count == 2270) {
        this.cars[0].acceleration = -0.002
      }
      if (count == 2270+500) {
        this.cars[0].acceleration = 0
        this.cars[0].speed = 0
      }
      // 2, 3 go //
      if (count == 2820) {
        this.cars[1].acceleration = 0.0025
        this.cars[2].acceleration = 0.0025
      }
      if (count == 2820+400) {
        this.cars[1].speed = 1
        this.cars[1].acceleration = 0
        this.cars[2].speed = 1
        this.cars[2].acceleration = 0
      }
      // 5, 6 stop //
      if (count == 3100) {
        this.cars[4].acceleration = -0.0025
        this.cars[5].acceleration = -0.0025
      }
      if (count == 3100+400) {
        this.cars[4].speed = 0
        this.cars[4].acceleration = 0
        this.cars[5].speed = 0
        this.cars[5].acceleration = 0
      }
      // 1 go //
      if (count == 3540) {
        this.cars[0].acceleration = 0.002
      }
      if (count == 3540+500) {
        this.cars[0].acceleration = 0
        this.cars[0].speed = 1
      }
      // 4 stop //
      if (count == 3823) {
        this.cars[3].acceleration = -0.002
      }
      if (count == 3823+500) {
        this.cars[3].speed = 0
        this.cars[3].acceleration = 0
      }
      // LOOP >> 4040 = 940 //
    }
  }

  async apply_car_styles() {
    for (let car of this.cars) {
      this.car_styles[car.id] = {
        'transform': 
          `translate(
            ${this.displacement_table[this.currentTick][car.id][0]}px, 
            ${this.displacement_table[this.currentTick][car.id][1]}px
          ) 
          rotate(${this.displacement_table[this.currentTick][car.id][2]}rad)`
      }
      car.rotation = this.displacement_table[this.currentTick][car.id][2]
    }
  }  
  
  async restartAnimation() {
    this.currentTick = 0
    this.interacted = true // to kill still-playing animations
    await lastValueFrom(timer(50))
    this.interacted = false
    while (this.currentTick < this.ticks) {
      this.currentTick += 1
      if (this.currentTick == 4040) {
        this.currentTick = 940
      }
      this.apply_car_styles()
      await lastValueFrom(timer(0))
      if (this.interacted) {
        break
      }
    }
  }

  ngAfterViewInit() {
    if (this.theme == 1) {
      this.setDarkTheme()
    } else {
      this.setLightTheme()
    }
  }

  setDarkTheme() {
    let x = document.getElementsByClassName("switch-touch-target")[0] as HTMLElement
    x.click()
    this.themeService.darkTheme()
  }
  
  setLightTheme() {
    this.themeService.lightTheme()
  }
}