export interface RaceParams {
  velocity: number;
  distance: number;
}

export interface Car {
  name: string;
  color: string;
  id: number;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export abstract class ApiHandler {
  private static baseUrl: string = 'http://127.0.0.1:3000';

  public static async getCars(): Promise<Car[]> {
    const response: Response = await fetch(`${this.baseUrl}/garage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const cars = await response.json();
    return cars;
  }

  public static async getCarsOnPage(currentPage: number): Promise<Car[]> {
    const response: Response = await fetch(`${this.baseUrl}/garage?_page=${currentPage}&_limit=7`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const cars = await response.json();
    return cars;
  }

  public static async createCar(name: string, color: string): Promise<number> {
    const response: Response = await fetch(`${this.baseUrl}/garage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        color,
      }),
    });

    const car = await response.json();
    return car.id;
  }

  public static async deleteCar(id: number): Promise<boolean> {
    if (id < 1) {
      throw new Error('Invalid id');
    }

    const response: Response = await fetch(`${this.baseUrl}/garage/${id}`, {
      method: 'DELETE',
    });

    if (response.status === 200) {
      return true;
    }
    if (response.status === 404) {
      throw new Error('Not found');
    }

    throw new Error(`Server error ${response.status}`);
  }

  public static async updateCar(id: number, name: string, color: string): Promise<boolean> {
    if (id < 1) {
      throw new Error('Invalid id');
    }

    const response: Response = await fetch(`${this.baseUrl}/garage/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        color,
      }),
    });

    if (response.status === 200) {
      return true;
    }
    if (response.status === 404) {
      throw new Error('Not found');
    }

    throw new Error(`Server error ${response.status}`);
  }

  public static async startEngine(id: number): Promise<RaceParams> {
    return this.handleEngine(id, 'started');
  }

  public static async stopEngine(id: number): Promise<boolean> {
    return !!(await this.handleEngine(id, 'stopped'));
  }

  private static async handleEngine(id: number, status: string): Promise<RaceParams> {
    if (id < 1) {
      throw new Error('Invalid id');
    }

    const response: Response = await fetch(`${this.baseUrl}/engine?id=${id}&status=${status}`, {
      method: 'PATCH',
    });

    if (response.status === 400) {
      throw new Error('Bad request');
    }
    if (response.status === 404) {
      throw new Error('Not found');
    }

    return response.json();
  }

  public static async go(id: number): Promise<number> {
    if (id < 1) {
      throw new Error('Invalid id');
    }

    const response: Response = await fetch(`${this.baseUrl}/engine?id=${id}&status=drive`, {
      method: 'PATCH',
    });

    if (response.status === 400) {
      throw new Error('Bad request');
    }
    if (response.status === 404) {
      throw new Error('Not found');
    }
    if (response.status === 500) {
      throw new Error('Engine died');
    }

    return id;
  }

  public static async getWinner(id: number): Promise<Winner> {
    const response: Response = await fetch(`${this.baseUrl}/winners/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const winner = await response.json();
    return winner;
  }

  public static async getWinners(): Promise<Winner[]> {
    const response: Response = await fetch(`${this.baseUrl}/winners`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const winners = await response.json();
    return winners;
  }

  public static async createWinner(id: number, wins: number, time: number): Promise<Winner> {
    const response: Response = await fetch(`${this.baseUrl}/winners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        wins,
        time,
      }),
    });

    const winner = await response.json();
    return winner;
  }

  public static async updateWinner(id: number, wins: number, time: number): Promise<Winner> {
    if (id < 1) {
      throw new Error('Invalid id');
    }

    const response: Response = await fetch(`${this.baseUrl}/winners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wins,
        time,
      }),
    });
    if (response.status === 200) {
      const winner = await response.json();
      return winner;
    }
    if (response.status === 404) {
      throw new Error('Not found');
    }

    throw new Error(`Server error ${response.status}`);
  }

  public static async modifyWinner(id: number, time: number): Promise<Winner> {
    const existWinner = await this.getWinner(id);
    let newWinner = null;

    if (existWinner.id) {
      const wins = existWinner.wins + 1;
      const bestTime = existWinner.time < time ? existWinner.time : time;
      newWinner = await this.updateWinner(id, wins, bestTime);
    } else {
      newWinner = await this.createWinner(id, 1, time);
    }

    return newWinner;
  }
}
