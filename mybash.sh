#!/bin/bash
path=$(pwd)

find $path -name "build.gradle" | while read -r currentFile;  
do
	while read -r line;
	do
		if [[ $line == *"buildToolsVersion \"23"* ]]
		then 
			chmod 777 $currentFile
			gedit $currentFile
			echo $line 
		fi ;
	done < $currentFile
done 
