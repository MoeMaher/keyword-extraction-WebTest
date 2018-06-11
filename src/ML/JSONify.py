import json

commonWords_path = '/media/maher/Windows/Users/mohamed mahre/Desktop/keyword-extract-keywordsGenerator/keywords-react2/src/ML/common_words.txt'

f = open(commonWords_path, "r")
common_words = f.readlines()

common_words = [w[:-1] for w in common_words]

with open('common.words.json', 'w') as outfile:
    json.dump(common_words, outfile)

bag_path = '/media/maher/Windows/Users/mohamed mahre/Desktop/keyword-extract-keywordsGenerator/keywords-react2/src/ML/bag_of_words.txt'


f = open(bag_path, "r")
bag = f.readlines()

bag = [w[:-1] for w in bag]

with open('bag.words.json', 'w') as outfile:
    json.dump(bag, outfile)
