package main

import (
	"backend/internal/api/models/address"
	"backend/internal/api/models/record"

	"log"
	"os"
)

func main() {
	query := os.Args[1]
	addressSubmitter := address.TestSubmitter{}
	addressResult, err := addressSubmitter.Submit(&address.Request{Address: query})
	if err != nil {
		log.Fatal(err)
	}

	for _, candidate := range addressResult.Candidates {
		log.Printf("%f:%s:%d\n", candidate.Attributes.Score, candidate.Address, candidate.Attributes.Ref_ID)
		recordRequest := record.Request{Ref_ID: candidate.Attributes.Ref_ID}
		recordSubmitter := record.TestSubmitter{}
		recordResult, err := recordSubmitter.Submit(&recordRequest)
		if err != nil {
			log.Fatal(err)
		}
		log.Printf("%v\n", recordResult)
	}
}
