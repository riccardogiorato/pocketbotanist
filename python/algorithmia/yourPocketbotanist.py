import Algorithmia
import tensorflow as tf
import os
import numpy as np  
import base64
from io import BytesIO
from PIL import Image
import json

client = Algorithmia.client()
graph_def = tf.GraphDef()
labels = []
# data://riccardogiorato/modeltf_test/labels.txt
labels_filename = client.file("data://riccardogiorato/modeltf_test/labels.txt").getFile().name
# data://riccardogiorato/modeltf_test/model.pb
filename = client.file("data://riccardogiorato/modeltf_test/model.pb").getFile().name

# Import the TF graph
with tf.gfile.FastGFile(filename, 'rb') as f:
    graph_def.ParseFromString(f.read())
    tf.import_graph_def(graph_def, name='')

# Create a list of labels.
with open(labels_filename, 'rt') as lf:
    for l in lf:
        labels.append(l.strip())

output_layer = 'loss:0'
input_node = 'Placeholder:0'

def decode_base64(data):
    data = data.encode('UTF-8')
    """Decode base64, padding being optional.

    :param data: Base64 data as an ASCII byte string
    :returns: The decoded byte string.

    """
    missing_padding = len(data) % 4
    if missing_padding != 0:
        data += b'='* (4 - missing_padding)
    return base64.decodestring(data)

# API calls will begin at the apply() method, with the request body passed as 'input'
# For more details, see algorithmia.com/developers/algorithm-development/languages
def apply(input):

  encoded_image = input.split(",")[1]
 
  image_bytes = BytesIO(decode_base64(encoded_image))
  im = Image.open(image_bytes)
  colors = np.array(im).T
  bgr_image = np.array([colors[0],colors[1],colors[2]]).transpose()

  with tf.Session() as sess:
    prob_tensor = sess.graph.get_tensor_by_name(output_layer)
    predictions, = sess.run(prob_tensor, {input_node: [bgr_image] })
  highest_probability_index = np.argmax(predictions)
  
  return(json.dumps({'label': labels[highest_probability_index],'value': np.float64(round(predictions[highest_probability_index],8))})) 
