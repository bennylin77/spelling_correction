#import sys;
#import json

#colors = ['red', 'blue', 'green']
#co = ['a', 'b', 'c']
#print(json.dumps( { "abc": colors, "ggc": co }));


#print(111);
#sys.stdout.flush();
#sys.exit()



################ Spelling Corrector

import re
from collections import Counter

def words(text): return re.findall(r'\w+', text.lower())
def words_2(text):
    return dict( (k, int(v)) for k,v in ( x.strip().split(' ') for x in text) )

WORDS_1 = Counter(words(open('big.txt').read()))
WORDS_2 = Counter(words_2( open('en_full.txt').readlines()))
WORDS = WORDS_1 + WORDS_2;

def P(word, N=sum(WORDS.values())):
    "Probability of `word`."
    return WORDS[word] / N

def correction(word):
    "Most probable spelling correction for word."
    return max(candidates(word), key=P)

def candidates(word):
    "Generate possible spelling corrections for word."
    return (known([word]) or known(edits1(word)) or known(edits2(word)) or [word])

def known(words):
    "The subset of `words` that appear in the dictionary of WORDS."

    return sorted(set(w for w in words if w in WORDS), key=P)

def edits1(word):
    "All edits that are one edit away from `word`."
    letters    = 'abcdefghijklmnopqrstuvwxyz'
    splits     = [(word[:i], word[i:])    for i in range(len(word) + 1)]
    deletes    = [L + R[1:]               for L, R in splits if R]
    transposes = [L + R[1] + R[0] + R[2:] for L, R in splits if len(R)>1]
    replaces   = [L + c + R[1:]           for L, R in splits if R for c in letters]
    inserts    = [L + c + R               for L, R in splits for c in letters]
    return set(deletes + transposes + replaces + inserts)

def edits2(word):
    "All edits that are two edits away from `word`."
    return (e2 for e1 in edits1(word) for e2 in edits1(e1))

#print("========PyEnchant========");

import enchant
from enchant.tokenize import get_tokenizer, EmailFilter
dict = enchant.Dict("en_US")


################ Read json
import json
import sys;
word = sys.argv[1];
#if not dict.check(word):
#	if not any(s.lower() == word.lower() for s in dict.suggest(word)) or not any(s.lower() == word.lower() for s in candidates(word)):
norvig = list(reversed(candidates(word)));
enchant = dict.suggest(word);
print( json.dumps( {'Norvig': norvig, 'Enchant': enchant}  ) )
sys.stdout.flush();
sys.exit();
#	else:
#		print( json.dumps( {'checked': True}  ) )
#		sys.stdout.flush();
#		sys.exit();
#else:
#	print( json.dumps( {'checked': True}  ) )
#	sys.stdout.flush();
#	sys.exit();




"""
import json
import sys;



print( json.dumps( sys.argv[1] ) )
sys.stdout.flush();
sys.exit();
"""
