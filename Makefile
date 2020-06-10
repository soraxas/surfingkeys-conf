.PHONY: clean

TIME_STAMP=$(shell date '+%Y-%m-%d %H:%M')
BUILT_COMMENT="// Built on $(TIME_STAMP)"

DIR=build
CONF_NAME=surfingkeys.js
CONF=$(DIR)/$(CONF_NAME)
CONF_TMP=$(CONF).tmp

# depends on all *.js files
JS_SRC=$(wildcard *.js)


all: $(CONF)

$(CONF): $(JS_SRC)
	gulp build
	#	add timestamp to config
	#	use a tmp file to echo to beginning of file
	echo $(BUILT_COMMENT) | cat - $(CONF) > $(CONF_TMP) && mv $(CONF_TMP) $(CONF)

clean:
	rm $(DIR)/*

