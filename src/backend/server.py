from flask import Flask, request, jsonify
import numpy as np
import time
from pulp import LpProblem, LpMinimize, LpVariable, lpSum
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route('/api/optimize', methods=['POST'])
def optimize_route():
    # Get data from the request
    data = request.get_json()
   
    # Extract data
    farms = data['farms']
    hubs = data['hubs']
    centers = data['centers']
    farm_to_hub_dist = data['farm_to_hub_dist']
    hub_to_center_dist = data['hub_to_center_dist']

    print(farms)
    print(hubs)
    print(centers)
    print(farm_to_hub_dist)
    print(hub_to_center_dist)

    # Helper functions (same as provided)
    def genetic_algorithm(farms, farm_to_hub_dist, hub_to_center_dist, generations=100, population_size=100, mutation_rate=0.1):
        start_time = time.time()
        population = [np.random.permutation(len(farms)) for _ in range(population_size)]
        best_solution = None
        best_cost = float('inf')

        for generation in range(generations):
            population_costs = []
            for solution in population:
                best_route, total_cost = calculate_best_route(farms, solution, farm_to_hub_dist, hub_to_center_dist)
                population_costs.append((solution, total_cost))
            population_costs.sort(key=lambda x: x[1])
            selected_population = [x[0] for x in population_costs[:population_size // 2]]
            offspring = []
            for i in range(0, len(selected_population), 2):
                parent1 = selected_population[i]
                parent2 = selected_population[i + 1] if i + 1 < len(selected_population) else selected_population[0]
                child = crossover(parent1, parent2)
                if np.random.rand() < mutation_rate:
                    child = mutate(child)
                offspring.append(child)
            population = selected_population + offspring
            current_best = population_costs[0]
            if current_best[1] < best_cost:
                best_solution = current_best[0]
                best_cost = current_best[1]
        execution_time = time.time() - start_time
        return best_solution, best_cost, execution_time

    def crossover(parent1, parent2):
        point = np.random.randint(1, len(parent1) - 1)
        child = np.concatenate((parent1[:point], parent2[point:]))
        return child

    def mutate(solution):
        idx1, idx2 = np.random.choice(len(solution), size=2, replace=False)
        solution[idx1], solution[idx2] = solution[idx2], solution[idx1]
        return solution

    def calculate_best_route(farms, best_solution, farm_to_hub_dist, hub_to_center_dist):
        total_cost = 0
        for farm_index in best_solution:
            primary_hub = np.argmin(farm_to_hub_dist[farm_index])
            center = np.argmin(hub_to_center_dist[primary_hub])
            total_cost += farm_to_hub_dist[farm_index][primary_hub] + hub_to_center_dist[primary_hub][center]
        return best_solution, total_cost

    def linear_programming_benchmark(farms, hubs, centers, farm_to_hub_dist, hub_to_center_dist):
        start_time = time.time()
        prob = LpProblem("Transport_Optimization", LpMinimize)
        farm_hub_vars = {(f['id'], h['id']): LpVariable(f"x_{f['id']}_{h['id']}", lowBound=0, cat="Continuous") for f in farms for h in hubs}
        hub_center_vars = {(h['id'], c['id']): LpVariable(f"y_{h['id']}_{c['id']}", lowBound=0, cat="Continuous") for h in hubs for c in centers}

        prob += lpSum(
            farm_hub_vars[f_id, h_id] * farm_to_hub_dist[f_id][h_id] +
            hub_center_vars[h_id, c_id] * hub_to_center_dist[h_id][c_id]
            for f_id, h_id in farm_hub_vars for c_id in [hc[1] for hc in hub_center_vars if hc[0] == h_id]
        )
        for farm in farms:
            prob += lpSum(farm_hub_vars[farm['id'], h['id']] for h in hubs) == farm['quantity']
        for hub in hubs:
            prob += lpSum(farm_hub_vars[f['id'], hub['id']] for f in farms) <= hub['capacity']
            prob += lpSum(hub_center_vars[hub['id'], c['id']] for c in centers) <= hub['capacity']
        for center in centers:
            prob += lpSum(hub_center_vars[h['id'], center['id']] for h in hubs) >= center['demand']

        prob.solve()
        lp_cost = sum(
            farm_hub_vars[f_id, h_id].varValue * farm_to_hub_dist[f_id][h_id]
            for f_id, h_id in farm_hub_vars
        )
        execution_time = time.time() - start_time
        return lp_cost, execution_time

    def greedy_heuristics_benchmark(farms, hubs, centers, farm_to_hub_dist, hub_to_center_dist):
        start_time = time.time()
        total_cost = 0
        path = []
        for farm in farms:
            nearest_hub = np.argmin(farm_to_hub_dist[farm['id']])
            nearest_center = np.argmin(hub_to_center_dist[nearest_hub])
            total_cost += farm_to_hub_dist[farm['id']][nearest_hub] + hub_to_center_dist[nearest_hub][ nearest_center]
            path.append({'farm': farm['id'], 'hub': nearest_hub, 'center': nearest_center})
        execution_time = time.time() - start_time
        return total_cost, execution_time, path

    # Execute algorithms
    ga_solution, ga_cost, ga_time = genetic_algorithm(farms, farm_to_hub_dist, hub_to_center_dist)
    ga_path, _ = calculate_best_route(farms, ga_solution, farm_to_hub_dist, hub_to_center_dist)
    lp_cost, lp_time = linear_programming_benchmark(farms, hubs, centers, farm_to_hub_dist, hub_to_center_dist)
    greedy_cost, greedy_time, greedy_path = greedy_heuristics_benchmark(farms, hubs, centers, farm_to_hub_dist, hub_to_center_dist)

    # Recursive function to convert NumPy int64 to Python int
    def convert_np_int_to_python(data):
        if isinstance(data, list):  # If data is a list, apply recursively to each item
            return [convert_np_int_to_python(item) for item in data]
        elif isinstance(data, dict):  # If data is a dictionary, apply recursively to each value
            return {key: convert_np_int_to_python(value) for key, value in data.items()}
        elif isinstance(data, np.int64):  # If it's a NumPy int64, convert it to a Python int
            return int(data)
        else:
            return data  # Return the data unchanged if it's not a NumPy int64

    # Convert greedy_path list of dictionaries
    genetic_path_int32 = convert_np_int_to_python(ga_path)

    # Return results as JSON
    response = {
        "NovelAlgorithm": {
            "Cost": float(ga_cost),
            "ExecutionTime": float(ga_time),
            "Path": genetic_path_int32
        },
        "LinearProgramming": {
            "Cost": float(lp_cost),
            "ExecutionTime": float(lp_time),
        },
        "GreedyHeuristics": {
            "Cost": float(greedy_cost),
            "ExecutionTime": float(greedy_time),
        }
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
