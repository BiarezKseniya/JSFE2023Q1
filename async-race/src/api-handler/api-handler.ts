export interface RaceParams {
  velocity: number;
  distance: number;
}

export interface Car {
  name: string;
  color: string;
  id: number;
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

    // Check of status
    // response.ok
    // response.status

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

    // response.ok
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
}
