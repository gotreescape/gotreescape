from dsl_collection import compute_tree_vis_index
from process_csv import read_csv_data, save_csv_data
from process_json import load_json_obj, save_json_obj
import numpy as np
from heapq import nsmallest
import os
from threading import Thread
import random, math

latent_vector_list = []
cluster_tree_umap_with_amount_avg = {}
cluster_content_umap = []
all_cluster_nearest_neighbor = {}

NEIGHBOR_AMOUNT = 50

def compute_vector_dist(subtree_avg_latent_vector, tree_vis_latent_vector):
    '''
    '''
    subtree_avg_latent_vector = np.array(subtree_avg_latent_vector)
    tree_vis_latent_vector = np.array(tree_vis_latent_vector)
    return np.linalg.norm(subtree_avg_latent_vector - tree_vis_latent_vector)

def traverse_tree_and_get_cluster(cluster_tree_umap, tree_vis_latent_vector, traverse_path_clusters):
    '''
    '''
    # if 'left' not in cluster_tree_umap and 'right' not in cluster_tree_umap:
    traverse_path_clusters.append(cluster_tree_umap['inner_leaf'])
    if 'left' in cluster_tree_umap and 'right' in cluster_tree_umap:
        left_avg_latent_vector = cluster_tree_umap['left']['avg_latent_vector']
        right_avg_latent_vector = cluster_tree_umap['right']['avg_latent_vector']
        distance_left = compute_vector_dist(left_avg_latent_vector, tree_vis_latent_vector)
        distance_right = compute_vector_dist(right_avg_latent_vector, tree_vis_latent_vector)
        if distance_left > distance_right:
            traverse_tree_and_get_cluster(cluster_tree_umap['right'], tree_vis_latent_vector, traverse_path_clusters)
        elif distance_right > distance_left:
            traverse_tree_and_get_cluster(cluster_tree_umap['left'], tree_vis_latent_vector, traverse_path_clusters)

def init_latent_vector_results():
    '''
        initialize the latent vector collections
    '''
    global latent_vector_list
    latent_vector_list = read_csv_data('./sourcedata/latent_vector_results.csv')

def init_clustering_tree_umap():
    '''
        initialize the latent vector collections
    '''
    global cluster_tree_umap_with_amount_avg
    cluster_tree_umap_with_amount_avg = load_json_obj('./sourcedata/clustering_tree-with_node_index_depth_parent_amount_avg.json')

def init_cluster_content_umap():
    '''
        initialize the cluster content umap
    '''
    global cluster_content_umap
    cluster_content_umap = read_csv_data('./sourcedata/cluster_content-umap.csv')

def transform_list_str_to_float(tree_vis_latent_vector):
    '''
        transform string to float
    '''
    for i in range(len(tree_vis_latent_vector)):
        tree_vis_latent_vector[i] = float(tree_vis_latent_vector[i])
    return tree_vis_latent_vector

def save_traverse_path_cluster(traverse_path_clusters, tree_vis_cluster_index):
    '''
    '''
    traverse_path_cluster_folder_name = './traverse_path_cluster'
    if not os.path.exists(traverse_path_cluster_folder_name):
        os.makedirs(traverse_path_cluster_folder_name)
    save_json_obj(traverse_path_clusters, os.path.join(traverse_path_cluster_folder_name, str(tree_vis_cluster_index) + '.json'))

def compute_all_cluster_nearest_neighbor(traverse_path_clusters, tree_vis_latent_vector):
    '''
        initialize the nearest neighbors of all clusters
    '''
    global all_cluster_nearest_neighbor
    displayed_level_threshold = 2
    for displayed_level in range(len(traverse_path_clusters)-1, -1, -1):
        divide = round(math.pow((len(traverse_path_clusters) - displayed_level), 2))
        print('divide', divide)
        neighbor_amount = round(NEIGHBOR_AMOUNT / divide)
        print('neighbor_amount', neighbor_amount)
        for cluster_index in traverse_path_clusters[displayed_level]:
            if cluster_index not in all_cluster_nearest_neighbor:
                if (displayed_level <= displayed_level_threshold):
                    all_cluster_nearest_neighbor[cluster_index] = []
                else:
                    all_cluster_nearest_neighbor[cluster_index] = compute_tree_vis_cluster_neighbor(tree_vis_latent_vector, cluster_index, neighbor_amount)
    print('finish initialize')

def compute_tree_vis_projection_pos(search_target):
    '''
        the start of compute tree vis start position
    '''
    global all_cluster_nearest_neighbor
    # when the search target change, we need to reset all_cluster_nearest_neighbor dictionary
    all_cluster_nearest_neighbor = {}
    neighbor_amount = NEIGHBOR_AMOUNT
    # compute the index of target tree visualization
    tree_vis_index = compute_tree_vis_index(search_target)
    print('tree_vis_index', tree_vis_index)
    # compute the treevis latent vector in tree visualization 
    tree_vis_latent_vector = latent_vector_list[tree_vis_index]
    tree_vis_latent_vector = transform_list_str_to_float(tree_vis_latent_vector)
    # the variable traverse_path_clusters save all the clusters along the path
    traverse_path_clusters = []
    traverse_tree_and_get_cluster(cluster_tree_umap_with_amount_avg, tree_vis_latent_vector, traverse_path_clusters)

    tree_vis_cluster_index = -1
    cluster_inner_neighbor = []
    if len(traverse_path_clusters) > 0:
        tree_vis_cluster_index = traverse_path_clusters[-1][0]
        print('tree_vis_cluster_index', tree_vis_cluster_index)
        # save the cluster list along traverse path
        save_traverse_path_cluster(traverse_path_clusters, tree_vis_cluster_index)
        # compute the representative tree index list of a single cluster
        cluster_inner_neighbor = compute_tree_vis_cluster_neighbor(tree_vis_latent_vector, tree_vis_cluster_index, neighbor_amount)
        # initialize all_cluster_nearest_neighbor
        all_cluster_nearest_neighbor[tree_vis_cluster_index] = cluster_inner_neighbor
        # initialize new thread
        thread = Thread(target=compute_all_cluster_nearest_neighbor, args=(traverse_path_clusters, tree_vis_latent_vector, ))
        thread.start()
    print('cluster_inner_neighbor', cluster_inner_neighbor)
    print('traverse_path_clusters.length', len(traverse_path_clusters))
    return tree_vis_latent_vector, tree_vis_cluster_index, cluster_inner_neighbor

def compute_tree_vis_cluster_neighbor(target_tree_vis_latent_vector, tree_vis_cluster_index, neighbor_amount):
    '''
    '''
    cluster_content = cluster_content_umap[tree_vis_cluster_index]
    dist_obj_list = []
    for treevis_index in cluster_content:
        treevis_index = int(treevis_index)
        treevis_latent_vector = latent_vector_list[treevis_index]
        treevis_latent_vector = transform_list_str_to_float(treevis_latent_vector)
        vec_dist = compute_vector_dist(treevis_latent_vector, target_tree_vis_latent_vector)
        dist_obj_list.append({'index': treevis_index, 'dist': vec_dist})
    neighbor_list = nsmallest(neighbor_amount, dist_obj_list, key=lambda dist_obj: abs(dist_obj['dist']))
    return neighbor_list

def compute_neighbor_representative(max_displayed_level, displayed_level, target_cluster_index):
    traverse_path_clusters_results = load_json_obj('./traverse_path_cluster/' + str(target_cluster_index) + '.json')
    # compute the diaplayed level, according to the displayed level
    displayed_cluster_level = (len(traverse_path_clusters_results) - 1) - (max_displayed_level - displayed_level)
    if displayed_cluster_level <= 0:
        displayed_cluster_level = 0
    displayed_cluster_level = int(displayed_cluster_level)
    selected_cluster_index_list_displayed_level = traverse_path_clusters_results[displayed_cluster_level:]
    # add cluster index from bottom to up
    selected_cluster_index_list = []
    for i in range(len(selected_cluster_index_list_displayed_level)-1,-1,-1):
        selected_cluster_index_list_single_level = selected_cluster_index_list_displayed_level[i]
        for cluster_index in selected_cluster_index_list_single_level:
            if cluster_index not in selected_cluster_index_list:
                selected_cluster_index_list.append(cluster_index)
    # update cluster_representative and cluster_preview_representative_list
    cluster_representative_obj_list = []
    cluster_preview_representative_obj_list = []
    for selected_cluster_index in selected_cluster_index_list:
        selected_cluster_nearest_neighbor = all_cluster_nearest_neighbor[selected_cluster_index]
        preview_representative_length = math.ceil(len(selected_cluster_nearest_neighbor) / 2)
        cluster_representative_obj_list = cluster_representative_obj_list + selected_cluster_nearest_neighbor
        cluster_preview_representative_obj_list = cluster_preview_representative_obj_list + selected_cluster_nearest_neighbor[:preview_representative_length]
    # transform object list to index list
    cluster_representative_index_list = []
    cluster_preview_representative_index_list = []
    for representative_item in cluster_representative_obj_list:
        cluster_representative_index_list.append(representative_item['index'])
    for preview_representative_item in cluster_preview_representative_obj_list:
        cluster_preview_representative_index_list.append(preview_representative_item['index'])
    return cluster_representative_index_list, cluster_preview_representative_index_list




